    import { Controller, Post, Get,Body,Res,Request  } from '@nestjs/common';
    import { UsersService } from './users.service.js';
    import type { Response } from 'express';
    import {RegisterDto} from './dto.user/register.dto.js';
    import { Public } from '../../authentication/public.decorator.js';

    @Controller('users')
  export class UsersController {
  constructor(private usersService: UsersService) {}
  @Public() 
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.usersService.register(dto.email, dto.password);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    return { message: 'Registered successfully' };
  }

  @Public()
  @Post('singIn')
  async singIn(@Body()dto:RegisterDto,@Res({ passthrough: true }) res:Response){
  const {token} = await this.usersService.singIn(dto.email,dto.password);
  res.cookie('token',token,{
    httpOnly :true,
    secure:false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000,
  })
  return { message: 'Logged in successfully' };
  }
  @Get('me')
  getMe(@Request()req){
    return {userId:req.user.userId};
  }

  @Public()
 @Post('logout')
 logout(@Res({ passthrough: true }) res: Response) {
  res.clearCookie('token');
  return { message: 'Logged out successfully' };
 }
}

