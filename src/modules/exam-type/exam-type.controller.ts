import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParamID } from 'src/decorators/params-id.decorator';
import { CreateExamTypeDTO } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';
import { ExamTypeService } from './exam-type.service';

@Controller('api')
export class ExamTypeController {
  constructor(private readonly examTypeService: ExamTypeService) {}

  @Post('exam-type')
  async create(@Body() data: CreateExamTypeDTO) {
    return await this.examTypeService.create(data);
  }

  @Get('exam-types')
  async findAll() {
    return await this.examTypeService.findAll();
  }

  @Get('exam-type/:id')
  async findOne(@ParamID() id: Types.ObjectId) {
    return await this.examTypeService.findOne(id);
  }

  @Patch('exam-type/:id')
  async update(@ParamID() id: Types.ObjectId, @Body() data: UpdateExamTypeDto) {
    return await this.examTypeService.update(id, data);
  }

  @Delete('exam-type/:id')
  async remove(@ParamID() id: Types.ObjectId) {
    return await this.examTypeService.remove(id);
  }
}
