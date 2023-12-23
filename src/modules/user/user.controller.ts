import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from 'src/enum/userRole.enum';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { UserHeader } from 'src/types/user-header';
import { ParamID } from '../../decorators/params-id.decorator';
import { CreateUserBySolicitationDTO } from './dto/create-user-by-solicitation.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  @Roles(UserRole.Admin)
  async create(@Body() data: CreateUserDTO) {
    return await this.userService.create(data);
  }

  @Roles(UserRole.Admin)
  @Post('user-by-solicitation')
  async createBySolicitation(@Body() data: CreateUserBySolicitationDTO) {
    return await this.userService.createBySolicitation(data);
  }

  @Get('users')
  @Roles(UserRole.Admin, UserRole.User)
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('user/:id')
  @Roles(UserRole.Admin, UserRole.User)
  async findOne(@ParamID() id: Types.ObjectId, @Req() req: Request) {
    const user = req.user as UserHeader;

    // Se o usuário não for admin e não for o perfil dele, não permitir visualizar o perfil
    if (user._id.equals(id) && user.role === UserRole.User) {
      throw new UnauthorizedException({
        description: 'Você não tem permissão para visualizar este perfil..',
      });
    }

    return await this.userService.findOne(id);
  }

  @Patch('user/:id')
  @Roles(UserRole.Admin, UserRole.User)
  async update(
    @ParamID() id: Types.ObjectId,
    @Body() data: UpdateUserDTO,
    @Req() req: Request,
  ) {
    const user = req.user as UserHeader;

    // Se o usuário não for admin e não for o perfil dele, não permitir alterar o perfil
    if (user._id.equals(id) && user.role === UserRole.User) {
      throw new UnauthorizedException({
        description: 'Você não tem permissão para atualizar este perfil..',
      });
    }

    // Se o usuário for do tipo User, não permitir alterar o role
    if (user.role === UserRole.User) {
      delete data.role;
    }

    return await this.userService.update(id, data);
  }

  @Delete('user/:id')
  @Roles(UserRole.Admin)
  async remove(@ParamID() id: Types.ObjectId) {
    return await this.userService.remove(id);
  }
}
