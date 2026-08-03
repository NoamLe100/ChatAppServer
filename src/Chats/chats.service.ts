import { PrismaService } from "../service.js";
import { Injectable } from "@nestjs/common";
import { ConflictException,NotFoundException} from '@nestjs/common';

@Injectable()
export class ChatService {
   constructor(private prisma: PrismaService) {}
   async createChat(creatorId: number, memberIds: number[], isGroup: boolean, name?: string, pic?: string) {
      return this.prisma.chat.create({
         data :{isGroup,
               name,
               pic,
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
}
