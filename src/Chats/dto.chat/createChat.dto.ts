import { ApiProperty } from '@nestjs/swagger';
import { IsNumber,IsArray,IsBoolean,IsOptional,IsString} from 'class-validator';

export class createChat{
  @ApiProperty({ example: [2, 3], description: 'IDs of members to add' })
  @IsArray()
  @IsNumber({}, { each: true })
  memberIds!: number[];

  @ApiProperty({ example: true })
  @IsBoolean()
  isGroup!: boolean;

  @ApiProperty({ example: 'My Group', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pic?: string;
}