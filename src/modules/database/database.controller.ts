import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { CreateDatabaseDTO } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { ParamID } from 'src/decorators/params-id.decorator';
import { Types } from 'mongoose';

@Controller('api')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post('database')
  async create(@Body() createDatabaseDto: CreateDatabaseDTO) {
    return this.databaseService.create(createDatabaseDto);
  }

  @Get('databases')
  async findAll() {
    return this.databaseService.findAll();
  }

  @Get('database/:id')
  async findOne(@ParamID() id: Types.ObjectId) {
    return this.databaseService.findOne(id);
  }

  @Patch('database/:id')
  async update(
    @ParamID() id: Types.ObjectId,
    @Body() updateDatabaseDto: UpdateDatabaseDto,
  ) {
    return this.databaseService.update(id, updateDatabaseDto);
  }

  @Delete('database/:id')
  async remove(@ParamID() id: Types.ObjectId) {
    return this.databaseService.remove(id);
  }
}
