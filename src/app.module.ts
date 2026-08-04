import { Module } from '@nestjs/common';
import { UsersModule } from './users/dto.uers/users.module';
import {JwtAuthGuard } from './authentication/jwt-auth.guard'
import { APP_GUARD } from '@nestjs/core';
import {ChatsModule} from './Chats/chat.module'
import { JwtStrategy } from './authentication/jwt.strategy.js';



@Module({
  imports: [UsersModule,ChatsModule],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard },
    JwtStrategy
  ],
})
export class AppModule {}
