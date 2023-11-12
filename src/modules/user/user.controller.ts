import { CreateUserBySolicitationDTO } from './dto/create-user-by-solicitation.dto';
import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { ParamID } from 'src/decorators/params-id.decorator';
import { Types } from 'mongoose';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async createUser(@Body() data: CreateUserDTO) {
    return await this.userService.createUser(data);
  }

  @Post('user-by-solicitation')
  async createUserBySolicitation(@Body() data: CreateUserBySolicitationDTO) {
    return await this.userService.createUserBySolicitation(data);
  }

  @Get('users')
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Get('user/:id')
  async getUserById(@ParamID() id: Types.ObjectId) {
    return await this.userService.getUserById(id);
  }

  @Patch('user/:id')
  async updateUser(@ParamID() id: Types.ObjectId, @Body() data: CreateUserDTO) {
    return await this.userService.updateUser(id, data);
  }

  @Delete('user/:id')
  async deleteUser(@ParamID() id: Types.ObjectId) {
    return await this.userService.deleteUser(id);
  }
}
