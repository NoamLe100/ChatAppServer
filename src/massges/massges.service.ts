import { PrismaService } from ".././service.js";
import { Injectable } from "@nestjs/common";
import { ForbiddenException   } from '@nestjs/common';



@Injectable()
export class MassgesService{ 
   constructor(private prisma: PrismaService,) {}
   async sandMassge( sanderId :number ,groupId:number,text:string) {
      const inGroup = await this.prisma.chatMember.findFirst({
         where :{userId : sanderId ,groupId: groupId}
      })
      if(! inGroup){
         throw new ForbiddenException('you are not in the group');
      }
      return this.prisma.message.create({
         data:{senderId:sanderId,groupId:groupId,text:text}
      })
   }
   async getHistory (userId:number , groupId:number) {
       const inGroup = await this.prisma.chatMember.findFirst({
         where :{userId : userId ,groupId: groupId}
      })
      if(! inGroup){
         throw new ForbiddenException('you are not in the group');
      }
     return this.prisma.message.findMany({
      where:{groupId:groupId},
      orderBy :{sentAt:'asc'}
     }) 
   }
}
