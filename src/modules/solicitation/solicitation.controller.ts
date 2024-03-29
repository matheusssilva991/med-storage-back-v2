import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from 'src/enum/userRole.enum';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { ParamID } from '../../decorators/params-id.decorator';
import { CreateSolicitationDto } from './dto/create-solicitation.dto';
import { UpdateSolicitationDto } from './dto/update-solicitation.dto';
import { SolicitationService } from './solicitation.service';
import { SolicitationFilterDto } from './dto/solicitation-filter.dto';

@Controller('api')
export class SolicitationController {
  constructor(private readonly solicitationService: SolicitationService) {}

  @Post('solicitation')
  async create(@Body() createSolicitationDto: CreateSolicitationDto) {
    return this.solicitationService.create(createSolicitationDto);
  }

  @Get('solicitations')
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: SolicitationFilterDto) {
    if (Object.keys(query).length) {
      return await this.solicitationService.findAllWithFilter(query);
    }
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
    @Body() updateSolicitationDto: UpdateSolicitationDto,
  ) {
    return this.solicitationService.update(id, updateSolicitationDto);
  }

  @Delete('solicitation/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async remove(@ParamID() id: Types.ObjectId) {
    return this.solicitationService.remove(id);
  }
}
