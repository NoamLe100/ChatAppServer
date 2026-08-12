import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class JoinByCodeDto {
    @ApiProperty({ example: 'A3B9K' })
    @IsString()
    @Length(5, 5)
    code!: string;
}