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
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from 'src/enum/userRole.enum';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { ParamID } from '../../decorators/params-id.decorator';
import { CreateImageTypeDto } from './dto/create-image-type.dto';
import { UpdateImageTypeDto } from './dto/update-image-type.dto';
import { ImageTypeService } from './image-type.service';
import { ImageTypeFilterDto } from './dto/image-type-filter.dto';

@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImageTypeController {
  constructor(private readonly imageTypeService: ImageTypeService) {}

  @Post('image-type')
  @Roles(UserRole.Admin)
  async create(@Body() createImageTypeDto: CreateImageTypeDto) {
    return this.imageTypeService.create(createImageTypeDto);
  }

  @Get('image-types')
  @Roles(UserRole.Admin, UserRole.User)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: ImageTypeFilterDto) {
    if (Object.keys(query).length)
      return this.imageTypeService.findAllWithFilter(query);
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
    @Body() updateImageTypeDto: UpdateImageTypeDto,
  ) {
    return this.imageTypeService.update(id, updateImageTypeDto);
  }

  @Delete('image-type/:id')
  @Roles(UserRole.Admin)
  async remove(@ParamID() id: Types.ObjectId) {
    return this.imageTypeService.remove(id);
  }
}
