import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/dto.uers/users.module';
import { JwtAuthGuard } from './authentication/jwt-auth.guard';
import { ChatsModule } from './Chats/chat.module';
import { JwtStrategy } from './authentication/jwt.strategy.js';
import { MassegModule } from './messages/massges.module';
import { JwtConfigModule } from './authentication/jwt-config.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, JwtConfigModule, UsersModule, ChatsModule, MassegModule],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    JwtStrategy,
  ],
})
export class AppModule {}