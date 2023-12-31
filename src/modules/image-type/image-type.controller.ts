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
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from 'src/enum/userRole.enum';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { ParamID } from '../../decorators/params-id.decorator';
import { CreateImageTypeDTO } from './dto/create-image-type.dto';
import { UpdateImageTypeDTO } from './dto/update-image-type.dto';
import { ImageTypeService } from './image-type.service';

@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImageTypeController {
  constructor(private readonly imageTypeService: ImageTypeService) {}

  @Post('image-type')
  @Roles(UserRole.Admin)
  async create(@Body() createImageTypeDto: CreateImageTypeDTO) {
    return this.imageTypeService.create(createImageTypeDto);
  }

  @Get('image-types')
  @Roles(UserRole.Admin, UserRole.User)
  async findAll() {
    return this.imageTypeService.findAll();
  }

  @Get('image-type/:id')
  @Roles(UserRole.Admin, UserRole.User)
  async findOne(@ParamID() id: Types.ObjectId) {
    return this.imageTypeService.findOne(id);
  }

  @Patch('image-type/:id')
  @Roles(UserRole.Admin)
  async update(
    @ParamID() id: Types.ObjectId,
    @Body() updateImageTypeDto: UpdateImageTypeDTO,
  ) {
    return this.imageTypeService.update(id, updateImageTypeDto);
  }

  @Delete('image-type/:id')
  @Roles(UserRole.Admin)
  async remove(@ParamID() id: Types.ObjectId) {
    return this.imageTypeService.remove(id);
  }
}
