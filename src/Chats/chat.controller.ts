    import { Controller, Post, Body,Request,Get } from '@nestjs/common';
    import {ChatService} from './chats.service'
    import {createChat}  from './dto.chat/createChat.dto'
    import {addMember}   from './dto.chat/addMemmber.dto'
    import { JoinByCodeDto } from './dto.chat/joinByCode.dto';
    import { ApiBearerAuth } from '@nestjs/swagger';

    @ApiBearerAuth()
    @Controller('chat')
    export class ChatController {
      constructor(private ChatService: ChatService) {}
      @Post('CreateChat')
      createChat(@Body()dto:createChat, @Request() req){
      return this.ChatService.createChat(req.user.userId,dto.memberIds,dto.isGroup,dto.name,dto.pic);
      }
      @Post('addMember')
      addMember(@Body()dto:addMember, @Request() req){
          return this.ChatService.addMember(req.user.userId , dto.Chatid)
      }@Get ('getMychat')
      getMychat(@Request() req) {
          return this.ChatService.getMychat(req.user.userId)
      }

      @Post('joinByCode')
    joinByCode(@Body() dto: JoinByCodeDto, @Request() req) {
    return this.ChatService.joinByCode(req.user.userId, dto.code);
  }
} 