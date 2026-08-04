import { Module } from "@nestjs/common";
import { PrismaService } from '../service';
import { MassgesService } from "./massges.service";
import { MassgesController } from "./massges.controller";

@Module({
    imports: [],
    controllers: [MassgesController],
    providers: [PrismaService,MassgesService],
})
export class MassegModule {}