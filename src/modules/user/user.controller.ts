import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from 'src/enum/userRole.enum';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { UserHeader } from 'src/types/user-header';
import { ParamID } from '../../decorators/params-id.decorator';
import { CreateUserBySolicitationDto } from './dto/create-user-by-solicitation.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { UserService } from './user.service';

@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  @Roles(UserRole.Admin)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Roles(UserRole.Admin)
  @Post('user-by-solicitation')
  async createBySolicitation(
    @Body() createUserBySolicitationDto: CreateUserBySolicitationDto,
  ) {
    return await this.userService.createBySolicitation(
      createUserBySolicitationDto,
    );
  }

  @Get('users')
  @Roles(UserRole.Admin, UserRole.User)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: UserFilterDto) {
    if (Object.keys(query).length) {
      return await this.userService.findAllWithFilter(query);
    }
    return await this.userService.findAll();
  }

  @Get('user/:id')
  @Roles(UserRole.Admin, UserRole.User)
  async findOne(@ParamID() id: Types.ObjectId) {
    return await this.userService.findOne(id);
  }

  @Patch('user/:id')
  @Roles(UserRole.Admin, UserRole.User)
  async update(
    @ParamID() id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const user = req.user as UserHeader;

    if (user.role === UserRole.User) {
      // Se o usuário for do tipo User, não permitir alterar o role
      delete updateUserDto.role;

      // Se não for o perfil dele, não permitir alterar o perfil
      if (!user._id.equals(id)) {
        throw new UnauthorizedException({
          description: 'Você não tem permissão para atualizar este perfil..',
        });
      }
    }

    return await this.userService.update(id, updateUserDto);
  }

  @Delete('user/:id')
  @Roles(UserRole.Admin)
  async remove(@ParamID() id: Types.ObjectId) {
    return await this.userService.remove(id);
  }
}
