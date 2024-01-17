import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateExamTypeDto } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';
import { ExamType } from './schema/exam-type.entity';

@Injectable()
export class ExamTypeService {
  constructor(
    @InjectModel('examType') private examTypeModel: Model<ExamType>,
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
    const examType = await this.examTypeModel.findByIdAndDelete(id).exec();

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
