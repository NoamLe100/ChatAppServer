import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogOut {
  @ApiProperty()
  @IsString()
  token!: string;
}
