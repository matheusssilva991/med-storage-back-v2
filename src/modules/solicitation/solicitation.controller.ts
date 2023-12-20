import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParamID } from '../../decorators/params-id.decorator';
import { CreateSolicitationDTO } from './dto/create-solicitation.dto';
import { UpdateSolicitationDTO } from './dto/update-solicitation.dto';
import { SolicitationService } from './solicitation.service';

@Controller('api')
export class SolicitationController {
  constructor(private readonly solicitationService: SolicitationService) {}

  @Post('solicitation')
  async create(@Body() data: CreateSolicitationDTO) {
    return this.solicitationService.create(data);
  }

  @Get('solicitations')
  async findAll() {
    return this.solicitationService.findAll();
  }

  @Get('solicitation/:id')
  async findOne(@ParamID() id: Types.ObjectId) {
    return this.solicitationService.findOne(id);
  }

  @Patch('solicitation/:id')
  async update(
    @ParamID() id: Types.ObjectId,
    @Body() data: UpdateSolicitationDTO,
  ) {
    return this.solicitationService.update(id, data);
  }

  @Delete('solicitation/:id')
  async remove(@ParamID() id: Types.ObjectId) {
    return this.solicitationService.remove(id);
  }
}
