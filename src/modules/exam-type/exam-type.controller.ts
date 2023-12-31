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
import { ParamID } from 'src/decorators/params-id.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from 'src/enum/userRole.enum';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { CreateExamTypeDTO } from './dto/create-exam-type.dto';
import { UpdateExamTypeDTO } from './dto/update-exam-type.dto';
import { ExamTypeService } from './exam-type.service';

@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamTypeController {
  constructor(private readonly examTypeService: ExamTypeService) {}

  @Post('exam-type')
  @Roles(UserRole.Admin)
  async create(@Body() data: CreateExamTypeDTO) {
    return await this.examTypeService.create(data);
  }

  @Get('exam-types')
  @Roles(UserRole.Admin, UserRole.User)
  async findAll() {
    return await this.examTypeService.findAll();
  }

  @Get('exam-type/:id')
  @Roles(UserRole.Admin, UserRole.User)
  async findOne(@ParamID() id: Types.ObjectId) {
    return await this.examTypeService.findOne(id);
  }

  @Patch('exam-type/:id')
  @Roles(UserRole.Admin)
  async update(@ParamID() id: Types.ObjectId, @Body() data: UpdateExamTypeDTO) {
    return await this.examTypeService.update(id, data);
  }

  @Delete('exam-type/:id')
  @Roles(UserRole.Admin)
  async remove(@ParamID() id: Types.ObjectId) {
    return await this.examTypeService.remove(id);
  }
}
