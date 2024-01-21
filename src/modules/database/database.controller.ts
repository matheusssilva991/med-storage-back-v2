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
import { ParamID } from 'src/decorators/params-id.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from 'src/enum/userRole.enum';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { DatabaseService } from './database.service';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { DatabaseFilterDto } from './dto/database-filter.dto';

@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post('database')
  @Roles(UserRole.Admin)
  async create(@Body() createDatabaseDto: CreateDatabaseDto) {
    return this.databaseService.create(createDatabaseDto);
  }

  @Get('databases')
  @Roles(UserRole.Admin, UserRole.User)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: DatabaseFilterDto) {
    if (Object.keys(query).length)
      return this.databaseService.findAllWithFilter(query);
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
