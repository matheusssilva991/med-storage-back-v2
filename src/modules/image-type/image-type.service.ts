import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateImageTypeDto } from './dto/create-image-type.dto';
import { UpdateImageTypeDto } from './dto/update-image-type.dto';
import { ImageType } from './schema/image-type.entity';

@Injectable()
export class ImageTypeService {
  constructor(
    @InjectModel('imageType') private imageTypeModel: Model<ImageType>,
  ) {}

  async create(data: CreateImageTypeDto) {
    // verifica se o tipo de imagem já existe
    await this.imageTypeAlreadyExists(data.name);

    try {
      const imageType = new this.imageTypeModel(data);
      return await imageType.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      return await this.imageTypeModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: Types.ObjectId) {
    // verifica se o tipo de image existe
    await this.imageTypeExists(id);

    try {
      return await this.imageTypeModel.findById(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByName(name: string) {
    try {
      // Use uma expressão regular case-insensitive para a consulta
      return await this.imageTypeModel
        .findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: Types.ObjectId, data: UpdateImageTypeDto) {
    let imageType = null;
    try {
      imageType = await this.imageTypeModel.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!imageType) {
      throw new NotFoundException('Tipo de imagem não encontrado.');
    }

    // verifica se o nome do tipo de imagem já existe
    if (imageType.name !== data.name) {
      await this.imageTypeAlreadyExists(data.name);
    }

    try {
      return await this.imageTypeModel
        .findByIdAndUpdate(id, { $set: data }, { new: true })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: Types.ObjectId) {
    // verifica se o tipo de image existe
    await this.imageTypeExists(id);

    try {
      return await this.imageTypeModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async imageTypeExists(id: Types.ObjectId) {
    let imageType = null;
    try {
      imageType = await this.imageTypeModel.exists({ _id: id });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!imageType) {
      throw new NotFoundException('Tipo de imagem não encontrado.');
    }
  }

  async imageTypeAlreadyExists(name: string) {
    let imageType = null;
    try {
      // Use uma expressão regular case-sensitive para a comparação
      imageType = await this.imageTypeModel.exists({
        name: { $regex: new RegExp(`^${name}$`) },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (imageType) {
      throw new BadRequestException('Tipo de imagem já foi cadastrado.');
    }
  }
}
