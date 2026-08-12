    import { Controller, Post, Body, Request } from '@nestjs/common';
    import { MassgesService } from './massges.service';
    import {SandMassgeDto} from './dto.massges/sandMassge.dto'
    import { GetHistory } from './dto.massges/get.massges';
    import { ApiBearerAuth } from '@nestjs/swagger';


    @ApiBearerAuth()
    @Controller('Massges') 
    export class MassgesController {
      constructor (private MassgesService:MassgesService) {}

      @Post('sandMassge')
      sendMasseg(@Body() dto:SandMassgeDto,@Request() req){
        return this.MassgesService.sandMassge(req.user.userId,dto.gruopId,dto.text)
      }

      @Post('getHistory')
      getHistory(@Body() dto:GetHistory,@Request() req){
        return this.MassgesService.getHistory(req.user.userId,dto.groupId)

      }
    }