    import { Controller, Post, Body } from '@nestjs/common';
    import { UsersService } from './users.service.js';
    import { UseGuards } from '@nestjs/common';
    import { AuthGuard } from '@nestjs/passport';
    import {RegisterDto} from './register.dto.js';
    import {LogOut} from './logOut.dto.js'

    @Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post('register')
  register(@Body() dto: RegisterDto){
    return this.usersService.register(dto.email,dto.password);
  }
  @Post('singIn')
  singIn(@Body()dto:RegisterDto){
  return this.usersService.singIn(dto.email, dto.password);
  }
    
    @UseGuards(AuthGuard('jwt'))
    @Post('singOut')
    singOut(@Body() dto:LogOut) {
    return this.usersService.singOut(dto.token);
  }
  
}

