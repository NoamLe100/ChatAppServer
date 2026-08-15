import { Controller, Post, Get, Body, Res, Request, Query,Patch } from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service.js';
import { RegisterDto } from './dto.user/register.dto.js';
import { Public } from '../../authentication/public.decorator.js';
import { UpdateBioeDto } from './dto.user/updateBio.dto.js';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public() 
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.usersService.register(dto.email, dto.password, dto.userName);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    return { message: 'Registered successfully' };
  }

  @Get('search')
  async search(@Query('query') query: string, @Request() req) {
  return this.usersService.searchUsers(query, req.user.userId);
}

  @Public()
  @Post('singIn')
  async singIn(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.usersService.singIn(dto.email, dto.password);
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });
    return { message: 'Logged in successfully' };
  }

@Get('me')
async getMe(@Request() req) {
  const user = await this.usersService.getUserById(req.user.userId);
  if (!user) return null;
  return { userId: user.id, name: user.name, userName: user.userName };
}
  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Logged out successfully' };
  }

  @Patch('me')
  async updateMe(@Body() dto: UpdateBioeDto, @Request() req) {
  return this.usersService.updateProfile(req.user.userId, dto.name, dto.userName);
}
}