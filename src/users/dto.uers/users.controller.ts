    import { Controller, Post, Body } from '@nestjs/common';
    import { UsersService } from './users.service.js';
    import {RegisterDto} from './dto.user/register.dto.js';
    import {LogOut} from './dto.user/logOut.dto.js'
    import { Public } from '../../authentication/public.decorator.js';
    import { ApiBearerAuth } from '@nestjs/swagger';

    @Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Public() 
  @Post('register')
  register(@Body() dto: RegisterDto){
    return this.usersService.register(dto.email,dto.password);
  }
  @Public()
  @Post('singIn')
  singIn(@Body()dto:RegisterDto){
  return this.usersService.singIn(dto.email, dto.password);
  }
  
  
}

