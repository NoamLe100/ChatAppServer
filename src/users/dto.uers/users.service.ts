import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../service.js";
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService:JwtService,) {}
        
  async register(email: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: { email, passwordHash },
    });
  }
   async singIn(email: string, password: string)
   {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
   });
   if (!existingUser) {
      throw new UnauthorizedException('User not fonde');
    }
    const isMatch = await bcrypt.compare(password, existingUser.passwordHash);
    if(!isMatch){
      throw new UnauthorizedException('worng password');
    }
    const token = this.jwtService.sign({userId:existingUser.id});
    return {token};

}
    async singOut(token: string){
        await this.prisma.revokedToken.create({ 
            data :{token}
        })
        return { message: 'Signed out successfully' }; 
    }
}