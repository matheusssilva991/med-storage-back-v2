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
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { DatabaseService } from './database.service';
import { CreateDatabaseDTO } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { UserRole } from 'src/enum/userRole.enum';
import { Roles } from 'src/decorators/role.decorator';

@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post('database')
  @Roles(UserRole.Admin)
  async create(@Body() createDatabaseDto: CreateDatabaseDTO) {
    return this.databaseService.create(createDatabaseDto);
  }

  @Get('databases')
  @Roles(UserRole.Admin, UserRole.User)
  async findAll() {
    return this.databaseService.findAll();
  }

  @Get('database/:id')
  @Roles(UserRole.Admin, UserRole.User)
  async findOne(@ParamID() id: Types.ObjectId) {
    return this.databaseService.findOne(id);
  }

  @Patch('database/:id')
  @Roles(UserRole.Admin)
  async update(
    @ParamID() id: Types.ObjectId,
    @Body() updateDatabaseDto: UpdateDatabaseDto,
  ) {
    return this.databaseService.update(id, updateDatabaseDto);
  }

  @Delete('database/:id')
  @Roles(UserRole.Admin)
  async remove(@ParamID() id: Types.ObjectId) {
    return this.databaseService.remove(id);
  }
}
