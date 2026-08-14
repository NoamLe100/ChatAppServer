import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength,IsString,Matches} from 'class-validator';

export class RegisterDto {
    @ApiProperty({example : 'test@test.com'})
    @IsEmail()
    email!:string;

    @ApiProperty({ example: '123456' })
    @MinLength(6)
    password!: string;

    @ApiProperty({ example: 'noam123' })
    @IsString()
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
    @MinLength(3)
    userName!: string;
}