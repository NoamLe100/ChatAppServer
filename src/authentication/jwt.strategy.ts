import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { PrismaService } from '../service.js';

const cookieExtractor = (req: Request): string | null => req?.cookies?.token ?? null;

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is not defined in .env`);
  }
  return value;
}

const jwtSecret = getRequiredEnv('JWT_SECRET');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { userId: number }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, userName: true },
    });

    if (!user) throw new UnauthorizedException();

    return { userId: user.id, userName: user.userName };
  }
}