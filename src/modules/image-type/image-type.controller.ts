import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParamID } from '../../decorators/params-id.decorator';
import { CreateImageTypeDTO } from './dto/create-image-type.dto';
import { UpdateImageTypeDTO } from './dto/update-image-type.dto';
import { ImageTypeService } from './image-type.service';

@Controller('api')
export class ImageTypeController {
  constructor(private readonly imageTypeService: ImageTypeService) {}

  @Post('image-type')
  async create(@Body() createImageTypeDto: CreateImageTypeDTO) {
    return this.imageTypeService.create(createImageTypeDto);
  }

  @Get('image-types')
  async findAll() {
    return this.imageTypeService.findAll();
  }

  @Get('image-type/:id')
  async findOne(@ParamID() id: Types.ObjectId) {
    return this.imageTypeService.findOne(id);
  }

  @Patch('image-type/:id')
  async update(
    @ParamID() id: Types.ObjectId,
    @Body() updateImageTypeDto: UpdateImageTypeDTO,
  ) {
    return this.imageTypeService.update(id, updateImageTypeDto);
  }

  @Delete('image-type/:id')
  async remove(@ParamID() id: Types.ObjectId) {
    return this.imageTypeService.remove(id);
  }
}
