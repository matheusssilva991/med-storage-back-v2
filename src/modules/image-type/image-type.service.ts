import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateImageTypeDto } from './dto/create-image-type.dto';
import { UpdateImageTypeDto } from './dto/update-image-type.dto';
import { ImageType } from './schema/image-type.entity';
import { ImageTypeFilterDto } from './dto/image-type-filter.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ImageTypeService {
  constructor(
    @InjectModel('imageType') private imageTypeModel: Model<ImageType>,
    @Inject(forwardRef(() => DatabaseService))
    private readonly databaseService: DatabaseService,
  ) {}

  async create(createImageTypeDto: CreateImageTypeDto) {
    // verifica se o tipo de imagem já existe
    await this.imageTypeAlreadyExists(createImageTypeDto.name);

    const imageType = new this.imageTypeModel(createImageTypeDto);
    return await imageType.save();
  }

  async findAll() {
    return await this.imageTypeModel.find().exec();
  }

  async findAllWithFilter(query: ImageTypeFilterDto) {
    const { name, page, limit, sort } = query;

    const filter = {
      ...(name && { name: { $regex: name, $options: 'i' } }),
    };

    // Paginação
    const defaultLimit = limit || 10;
    const skip = page ? (page - 1) * defaultLimit : 0;

    // Ordenação
    let sortObject: string;
    try {
      sortObject = JSON.parse(sort);
    } catch (error) {
      sortObject = sort || 'name';
    }

    return await this.imageTypeModel
      .find({ ...filter }, {}, { skip, limit })
      .sort(sortObject)
      .exec();
  }

  async findOne(id: Types.ObjectId) {
    // verifica se o tipo de image existe
    const imageType = await this.imageTypeModel.findById(id).exec();

    if (!imageType) {
      throw new NotFoundException('Tipo de imagem não encontrado.');
    }

    return imageType;
  }

  async findByName(name: string) {
    // Use uma expressão regular case-insensitive para a consulta
    const imageType = await this.imageTypeModel
      .findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
      .exec();

    if (!imageType) {
      throw new NotFoundException('Tipo de imagem não encontrado.');
    }

    return imageType;
  }

  async update(id: Types.ObjectId, updateImageTypeDto: UpdateImageTypeDto) {
    const imageType = await this.findOne(id);

    // verifica se o nome do tipo de imagem já existe
    if (imageType.name !== updateImageTypeDto.name) {
      await this.imageTypeAlreadyExists(updateImageTypeDto.name);
    }

    return await this.imageTypeModel
      .findByIdAndUpdate(id, { $set: updateImageTypeDto }, { new: true })
      .exec();
  }

  async remove(id: Types.ObjectId) {
    let imageType = await this.findOne(id);
    const databases = await this.databaseService.findAllWithFilter({
      imageType: imageType.name,
    } as any);

    if (databases.length) {
      throw new BadRequestException(
        'Não é possível excluir este tipo de imagem, pois ele está associado a um ou mais exames.',
      );
    }

    imageType = await this.imageTypeModel.findByIdAndDelete(id).exec();

    if (!imageType) {
      throw new NotFoundException('Tipo de imagem não encontrado.');
    }

    return imageType;
  }

  async imageTypeAlreadyExists(name: string) {
    const imageType = await this.imageTypeModel.exists({
      name: { $regex: new RegExp(`^${name}$`) },
    });

    if (imageType) {
      throw new BadRequestException('Tipo de imagem já foi cadastrado.');
    }
  }
}
