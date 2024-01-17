import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExamTypeService } from '../exam-type/exam-type.service';
import { ImageTypeService } from '../image-type/image-type.service';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { Database } from './schema/database.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel('database') private readonly databaseModel: Model<Database>,
    private readonly imageTypeService: ImageTypeService,
    private readonly examTypeService: ExamTypeService,
  ) {}

  async create(createDatabaseDto: CreateDatabaseDto) {
    // verifica se o banco de imagens já existe
    await this.databaseAlreadyExists(createDatabaseDto.name);

    await this.checkExamType(createDatabaseDto);
    await this.checkImageType(createDatabaseDto);

    const database = new this.databaseModel(createDatabaseDto);
    return await database.save();
  }

  async findAll() {
    return await this.databaseModel.find().exec();
  }

  async findOne(id: Types.ObjectId) {
    // verifica se o tipo de exame existe
    const database = await this.databaseModel.findById(id).exec();

    if (!database) {
      throw new NotFoundException('Banco de imagens não encontrado.');
    }

    return database;
  }

  async update(id: Types.ObjectId, updateDatabaseDto: UpdateDatabaseDto) {
    const database = await this.findOne(id);

    // verifica se o banco de imagens já existe
    if (database.name !== updateDatabaseDto.name) {
      await this.databaseAlreadyExists(updateDatabaseDto.name);
    }

    await this.checkExamType(updateDatabaseDto);
    await this.checkImageType(updateDatabaseDto);

    return await this.databaseModel
      .findByIdAndUpdate(id, { $set: updateDatabaseDto }, { new: true })
      .exec();
  }

  async remove(id: Types.ObjectId) {
    // verifica se o banco de imagens existe
    const database = await this.databaseModel.findByIdAndDelete(id).exec();

    if (!database) {
      throw new NotFoundException('Banco de imagens não encontrado.');
    }

    return database;
  }

  async databaseAlreadyExists(name: string) {
    const database = await this.databaseModel.exists({
      name: { $regex: new RegExp(`^${name}$`) },
    });

    if (database) {
      throw new BadRequestException(
        'Já existe banco de imagens cadastrado com esse nome',
      );
    }
  }

  async checkExamType(data: UpdateDatabaseDto) {
    if (data.examType) {
      const examType = await this.examTypeService.findByName(data.examType);

      data.examType = examType.name;
    }
  }

  async checkImageType(data: UpdateDatabaseDto) {
    if (data.imageType) {
      const imageType = await this.imageTypeService.findByName(data.imageType);

      data.imageType = imageType.name;
    }
  }
}
