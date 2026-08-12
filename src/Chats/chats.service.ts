import { PrismaService } from "../service.js";
import { Injectable } from "@nestjs/common";
import { ConflictException,NotFoundException} from '@nestjs/common';

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
   async addMember(userId:number,groupId:number){
      const inGroup = await this.prisma.chatMember.findFirst({
       where: { userId: userId, groupId: groupId },
    } )
    if(inGroup){
      throw new ConflictException('all ready in the group');
    }
    return this.prisma.chatMember.create(
      {data:{userId,groupId},
   })

   }
   async getMychat(userId:number){
    return this.prisma.chat.findMany({
      where:{
         members:{
            some:{userId}
         },
      },
      include:{members : true}
    }) 
   }
   
   async getChatByid(chatId:number,userId: number){
   const chat= await this.prisma.chat.findUnique({
         where:{id:chatId},
         include: {members :true}
      });   
      if(!chat) {
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
   
}
