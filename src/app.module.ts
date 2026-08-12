import { Module } from '@nestjs/common';
import { UsersModule } from './users/dto.uers/users.module';
import {JwtAuthGuard } from './authentication/jwt-auth.guard'
import { APP_GUARD } from '@nestjs/core';
import {ChatsModule} from './Chats/chat.module'
import { JwtStrategy } from './authentication/jwt.strategy.js';
import { MassegModule } from './messages/massges.module';
import { JwtConfigModule } from './authentication/jwt-config.module';



@Module({
  imports: [UsersModule,ChatsModule,MassegModule,JwtConfigModule ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard },
    JwtStrategy
  ],
})
export class AppModule {}
