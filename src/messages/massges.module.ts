import { Module } from "@nestjs/common";
import { PrismaService } from '../service';
import { MassgesService } from "./massges.service";
import { MassgesController } from "./massges.controller";
import { MessagesGateway } from './getway/messages.gateway';

@Module({
    imports: [],
    controllers: [MassgesController],   
    providers: [PrismaService,MassgesService, MessagesGateway],
})
export class MassegModule {}