import { ApiProperty } from '@nestjs/swagger';
import { IsString ,IsNumber} from 'class-validator';

export class SandMassgeDto {

    @ApiProperty()
    @IsNumber()
    gruopId!: number;
    
    @ApiProperty()
    @IsString()
    text! :string;
}