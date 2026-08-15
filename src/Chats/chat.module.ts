import { Module } from "@nestjs/common";
import { PrismaService } from '../service';
import { ChatController} from './chat.controller'
import { ChatService } from "./chats.service";

@Module({
    imports: [],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatsModule {}