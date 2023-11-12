import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParamID } from 'src/decorators/params-id.decorator';
import { CreateSolicitationDTO } from './dto/create-solicitation.dto';
import { UpdateSolicitationDTO } from './dto/update-solicitation.dto';
import { SolicitationService } from './solicitation.service';

@Controller()
export class SolicitationController {
  constructor(private readonly solicitationService: SolicitationService) {}

  @Post('solicitation')
  async createSolicitation(@Body() data: CreateSolicitationDTO) {
    return this.solicitationService.createSolicitation(data);
  }

  @Get('solicitations')
  async getSolicitations() {
    return this.solicitationService.getSolicitations();
  }

  @Get('solicitation/:id')
  async getSolicitationById(@ParamID() id: Types.ObjectId) {
    return this.solicitationService.getSolicitationById(id);
  }

  @Patch('solicitation/:id')
  async updateSolicitation(
    @ParamID() id: Types.ObjectId,
    @Body() data: UpdateSolicitationDTO,
  ) {
    return this.solicitationService.updateSolicitation(id, data);
  }

  @Delete('solicitation/:id')
  async deleteSolicitation(@ParamID() id: Types.ObjectId) {
    return this.solicitationService.deleteSolicitation(id);
  }
}
