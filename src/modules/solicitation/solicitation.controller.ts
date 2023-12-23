import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from 'src/enum/userRole.enum';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async findAll() {
    return this.solicitationService.findAll();
  }

  @Get('solicitation/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async findOne(@ParamID() id: Types.ObjectId) {
    return this.solicitationService.findOne(id);
  }

  @Patch('solicitation/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async update(
    @ParamID() id: Types.ObjectId,
    @Body() data: UpdateSolicitationDTO,
  ) {
    return this.solicitationService.update(id, data);
  }

  @Delete('solicitation/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async remove(@ParamID() id: Types.ObjectId) {
    return this.solicitationService.remove(id);
  }
}
