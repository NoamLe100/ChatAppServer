import { PrismaService } from "../service.js";
import { Injectable } from "@nestjs/common";
import { ConflictException,NotFoundException,ForbiddenException} from '@nestjs/common';

@Injectable()
export class ChatService {
   constructor(private prisma: PrismaService) {}

   async createChat(creatorId: number, memberIds: number[], isGroup: boolean, name?: string, pic?: string) {
       const code = await this.generateUniqueCode();
      return this.prisma.chat.create({
         data :{isGroup,
               name,
               pic,
               code,
               members :{
                 create: [...memberIds, creatorId].map(userId => ({ userId })),
               },
            }
      })
   }
 async addMember(actingUserId: number, groupId: number, newMemberId: number) {
  const actingUserInGroup = await this.prisma.chatMember.findFirst({
    where: { userId: actingUserId, groupId },
  });

  if (!actingUserInGroup) {
    throw new ForbiddenException('You are not a member of this group');
  }

  const alreadyMember = await this.prisma.chatMember.findFirst({
    where: { userId: newMemberId, groupId },
  });

  if (alreadyMember) {
    throw new ConflictException('User already in the group');
  }

  return this.prisma.chatMember.create({
    data: { userId: newMemberId, groupId },
  });
}
async getMychat(userId: number) {
  return this.prisma.chat.findMany({
    where: {
      members: {
        some: { userId }
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, userName: true }
          }
        }
      }
    }
  })
}
   
async getChatByid(chatId: number, userId: number) {
  const chat = await this.prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, userName: true }
          }
        }
      }
    }
  });
  if (!chat) {
    throw new NotFoundException('Chat not found');
  }
  return chat;
}
   async joinByCode(userId: number, code: string) {
   const chat = await this.prisma.chat.findUnique({ where: { code } });

   if (!chat) {
      throw new NotFoundException('Invalid code');
   }

   const alreadyMember = await this.prisma.chatMember.findFirst({
      where: { userId, groupId: chat.id }
   });

   if (alreadyMember) {
      throw new ConflictException('already in the group');
   }

   return this.prisma.chatMember.create({
      data: { userId, groupId: chat.id }
   });
}

   private generateCode(): string {
   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
   let code = '';
      for (let i = 0; i < 5; i++) {
         code += chars[Math.floor(Math.random() * chars.length)];
      }
      return code;
   }
   
   private async generateUniqueCode(): Promise<string> {
   let code = this.generateCode();
   
   let existing = await this.prisma.chat.findUnique({ where: { code } });
   
   while (existing) {
      code = this.generateCode();
      existing = await this.prisma.chat.findUnique({ where: { code } });
   }
   
   return code;
}

async startPrivateChat(myUserId: number, otherUserId: number) {
  const existing = await this.prisma.chat.findFirst({
    where: {
      isGroup: false,
      AND: [
        { members: { some: { userId: myUserId } } },
        { members: { some: { userId: otherUserId } } },
      ],
    },
    include: { members: true },
  });
  if (existing) {
    return existing;
  }
  return this.prisma.chat.create({
    data: {
      isGroup: false,
      members: {
        create: [{ userId: myUserId }, { userId: otherUserId }],
      },
    },
    include: { members: true },
  });
}   


}
