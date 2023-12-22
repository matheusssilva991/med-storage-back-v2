import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Types, Model } from 'mongoose';
import { CreateDatabaseDTO } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Database } from './schema/database.entity';
import { ImageTypeService } from '../image-type/image-type.service';
import { ExamTypeService } from '../exam-type/exam-type.service';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel('database') private readonly databaseModel: Model<Database>,
    private readonly imageTypeService: ImageTypeService,
    private readonly examTypeService: ExamTypeService,
  ) {}

  async create(data: CreateDatabaseDTO) {
    // verifica se o banco de imagens já existe
    await this.databaseAlreadyExists(data.name);

    await this.checkExamType(data);
    await this.checkImageType(data);

    try {
      const database = new this.databaseModel(data);
      return await database.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      return await this.databaseModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: Types.ObjectId) {
    // verifica se o tipo de exame existe
    await this.databaseExists(id);

    try {
      return await this.databaseModel.findById(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: Types.ObjectId, data: UpdateDatabaseDto) {
    let database = null;
    try {
      database = await this.databaseModel.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!database) {
      throw new NotFoundException('Banco de imagens não encontrado.');
    }

    // verifica se o banco de imagens já existe
    if (database.name !== data.name) {
      await this.databaseAlreadyExists(data.name);
    }

    await this.checkExamType(data);
    await this.checkImageType(data);

    try {
      return await this.databaseModel
        .findByIdAndUpdate(id, { $set: data }, { new: true })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: Types.ObjectId) {
    // verifica se o banco de imagens existe
    await this.databaseExists(id);

    try {
      return await this.databaseModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async databaseExists(id: Types.ObjectId) {
    let database = null;
    try {
      database = await this.databaseModel.exists({ _id: id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!database) {
      throw new NotFoundException('Banco de imagens não encontrado.');
    }
  }

  async databaseAlreadyExists(name: string) {
    let database = null;
    try {
      database = await this.databaseModel.exists({
        name: { $regex: new RegExp(`^${name}$`) },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (database) {
      throw new BadRequestException(
        'Já existe banco de imagens cadastrado com esse nome',
      );
    }
  }

  async checkExamType(data: UpdateDatabaseDto) {
    if (data.examType) {
      const examType = await this.examTypeService.findByName(data.examType);

      if (!examType) {
        throw new BadRequestException('Tipo de exame não existe.');
      }

      data.examType = examType.name;
    }
  }

  async checkImageType(data: UpdateDatabaseDto) {
    if (data.imageType) {
      const imageType = await this.imageTypeService.findByName(data.imageType);

      if (!imageType) {
        throw new BadRequestException('Tipo de imagem não existe.');
      }

      data.imageType = imageType.name;
    }
  }
}
