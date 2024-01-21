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
import { DatabaseFilterDto } from './dto/database-filter.dto';
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

    await this.examTypeService.findOne(createDatabaseDto.examType);
    await this.imageTypeService.findOne(createDatabaseDto.imageType);

    const database = new this.databaseModel(createDatabaseDto);
    return await database.save();
  }

  async findAll() {
    return await this.databaseModel
      .find()
      .populate('examType')
      .populate('imageType')
      .exec();
  }

  async findAllWithFilter(query: DatabaseFilterDto) {
    const { name, examType, imageType, page, limit, sort } = query;

    const filter = {
      ...(name && { name: { $regex: name, $options: 'i' } }),
      ...(examType && {
        'examType.name': { $regex: examType, $options: 'i' },
      }),
      ...(imageType && {
        'imageType.name': { $regex: imageType, $options: 'i' },
      }),
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

    return await this.databaseModel
      .find({ ...filter }, {}, { skip, limit })
      .sort(sortObject)
      .exec();
  }

  async findOne(id: Types.ObjectId) {
    // verifica se o tipo de exame existe
    const database = await this.databaseModel
      .findById(id)
      .populate('examType')
      .populate('imageType')
      .exec();

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

    await this.examTypeService.findOne(updateDatabaseDto.examType);
    await this.imageTypeService.findOne(updateDatabaseDto.imageType);

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
}
