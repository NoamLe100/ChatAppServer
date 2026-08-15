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
        
async register(email: string, password: string,userName:string) {
  const existingUser = await this.prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictException('User already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await this.prisma.user.create({
    data: { email, passwordHash, userName},
  });

  const token = this.jwtService.sign({ userId: newUser.id });
  return { token };
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

async searchUsers(query: string, currentUserId: number) {
  if (!query || query.length < 2) {
    return [];
  }

  return this.prisma.user.findMany({
    where: {
      userName: {
        contains: query,
        mode: 'insensitive',
      },
      id: { not: currentUserId },
    },
    select: {
      id: true,
      userName: true,
      name: true,
    },
    take: 10,
  });
}

async updateProfile(userId: number, name?: string, userName?: string) {
  if (userName) {
    const existing = await this.prisma.user.findUnique({ where: { userName } });
    if (existing && existing.id !== userId) {
      throw new ConflictException('Username already taken');
    }
  }

  return this.prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined && { name }),
      ...(userName !== undefined && { userName }),
    },
    select: { id: true, name: true, userName: true },
  });
}

async getUserById(userId: number) {
  return this.prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, userName: true },
  });
}
  
}