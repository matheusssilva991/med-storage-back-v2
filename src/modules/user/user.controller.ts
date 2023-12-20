import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParamID } from '../../decorators/params-id.decorator';
import { CreateUserBySolicitationDTO } from './dto/create-user-by-solicitation.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async create(@Body() data: CreateUserDTO) {
    return await this.userService.create(data);
  }

  @Post('user-by-solicitation')
  async createBySolicitation(@Body() data: CreateUserBySolicitationDTO) {
    return await this.userService.createBySolicitation(data);
  }

  @Get('users')
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('user/:id')
  async findOne(@ParamID() id: Types.ObjectId) {
    return await this.userService.findOne(id);
  }

  @Patch('user/:id')
  async update(@ParamID() id: Types.ObjectId, @Body() data: UpdateUserDTO) {
    return await this.userService.update(id, data);
  }

  @Delete('user/:id')
  async remove(@ParamID() id: Types.ObjectId) {
    return await this.userService.remove(id);
  }
}
