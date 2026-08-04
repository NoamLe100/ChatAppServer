import { PrismaService } from ".././service.js";
import { Injectable } from "@nestjs/common";


@Injectable()
export class MassgesService{ 
   constructor(private prisma: PrismaService,) {}

}
