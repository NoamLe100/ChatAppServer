import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/dto.uers/users.module';


@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}
