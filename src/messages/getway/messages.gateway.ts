import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../service';
import { MassgesService } from '../massges.service';


function parseCookie(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map(c => c.trim());
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) return value;
  }
  return null;
}


@WebSocketGateway({
  cors: { origin: 'http://localhost:5173', credentials: true }
})
export class MessagesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private massgesService: MassgesService,
  ) {}

  handleConnection(client: Socket) {
    const token = parseCookie(client.handshake.headers.cookie, 'token');
    if (!token) {
      console.log('not a vlid token');
      client.disconnect();
      return;
    }
    try {
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.userId;
      client.join(`user_${payload.userId}`);
      console.log('user connected:', payload.userId);
    }
    catch (error) {
      console.log('Invalid token, disconnecting');
      client.disconnect();
    }
  }

 @SubscribeMessage('joinRoom')
async handlejoinRoom(client: Socket, groupId: string): Promise<{ success: boolean }> {
  const userId = client.data.userId;

  const inGroup = await this.prisma.chatMember.findFirst({
    where: { userId, groupId: Number(groupId) }
  });

  if (!inGroup) {
    client.emit('error', 'You are not a member of this group');
    return { success: false };
  }

  const roomId = `room_${groupId}`;
  client.join(roomId);
  return { success: true };
}

  @SubscribeMessage('message')
  async handleMessages(client: Socket, payload: { roomId: string, text: string }) {
    const userId = client.data.userId;
    const groupId = Number(payload.roomId.replace('room_', ''));

    if (!groupId || Number.isNaN(groupId)) {
      client.emit('error', 'Room not found');
      return;
    }

    const savedMessage = await this.massgesService.sandMassge(userId, groupId, payload.text);

    this.server.to(payload.roomId).emit('message', savedMessage);

    const members = await this.prisma.chatMember.findMany({
      where: { groupId },
      select: { userId: true },
    });
    members.forEach(m => {
      this.server.to(`user_${m.userId}`).emit('chatsUpdated');
    });
  }
}