import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class addMember{
    @ApiProperty()
    @IsNumber()
    userid!:number

    @ApiProperty()
    @IsNumber()
    Chatid!:number
}