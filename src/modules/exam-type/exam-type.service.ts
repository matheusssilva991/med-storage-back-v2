import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DatabaseService } from '../database/database.service';
import { CreateExamTypeDto } from './dto/create-exam-type.dto';
import { ExamTypeFilterDto } from './dto/exam-type.filter.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';
import { ExamType } from './schema/exam-type.entity';

@Injectable()
export class ExamTypeService {
  constructor(
    @InjectModel('examType') private examTypeModel: Model<ExamType>,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(data: CreateExamTypeDto) {
    // verifica se o tipo de exame já existe
    await this.examTypeAlreadyExists(data.name);

    const examType = new this.examTypeModel(data);
    return await examType.save();
  }

  async findAll() {
    return await this.examTypeModel.find().exec();
  }

  async findAllWithFilter(query: ExamTypeFilterDto) {
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

    return await this.examTypeModel
      .find({ ...filter }, {}, { skip, limit })
      .sort(sortObject)
      .exec();
  }

  async findOne(id: Types.ObjectId) {
    const examType = await this.examTypeModel.findById(id).exec();

    if (!examType) {
      throw new NotFoundException('Tipo de exame não encontrado.');
    }

    return examType;
  }

  async findByName(name: string) {
    // Use uma expressão regular case-insensitive para a consulta
    const examType = await this.examTypeModel
      .findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
      .exec();

    if (!examType) {
      throw new NotFoundException('Tipo de exame não encontrado.');
    }

    return examType;
  }

  async update(id: Types.ObjectId, data: UpdateExamTypeDto) {
    const examType = await this.findOne(id);

    if (examType.name !== data.name) {
      // verifica se o tipo de exame já existe
      await this.examTypeAlreadyExists(data.name);
    }

    return await this.examTypeModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
  }

  async remove(id: Types.ObjectId) {
    let examType = await this.findOne(id);
    const databases = await this.databaseService.findAllWithFilter({
      examType: examType.name,
    } as any);

    if (databases.length) {
      throw new BadRequestException(
        'Não é possível excluir um tipo de exame que está sendo utilizado.',
      );
    }

    examType = await this.examTypeModel.findByIdAndDelete(id).exec();

    if (!examType) {
      throw new NotFoundException('Tipo de exame não encontrado.');
    }

    return examType;
  }

  async examTypeAlreadyExists(name: string) {
    const examType = await this.examTypeModel.exists({
      name: { $regex: new RegExp(`^${name}$`) },
    });

    if (examType) {
      throw new BadRequestException('Tipo de exame já foi cadastrado.');
    }
  }
}
