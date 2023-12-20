import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateExamTypeDTO } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';
import { ExamType } from './schema/exam-type.entity';

@Injectable()
export class ExamTypeService {
  constructor(
    @InjectModel('examType') private examTypeModel: Model<ExamType>,
  ) {}

  async create(data: CreateExamTypeDTO) {
    // verifica se o tipo de exame já existe
    await this.examTypeAlreadyExists(data.name);

    try {
      const examType = new this.examTypeModel(data);
      return await examType.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      return await this.examTypeModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: Types.ObjectId) {
    // verifica se o tipo de exame existe
    await this.examTypeExists(id);

    try {
      return await this.examTypeModel.findById(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: Types.ObjectId, data: UpdateExamTypeDto) {
    // verifica se o tipo de exame existe
    await this.examTypeExists(id);

    let examType = null;
    try {
      examType = await this.examTypeModel.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (examType.name !== data.name) {
      // verifica se o tipo de exame já existe
      await this.examTypeAlreadyExists(data.name);
    }

    try {
      return await this.examTypeModel
        .findByIdAndUpdate(id, { $set: data }, { new: true })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: Types.ObjectId) {
    // verifica se o tipo de exame existe
    await this.examTypeExists(id);

    try {
      return await this.examTypeModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async examTypeExists(id: Types.ObjectId) {
    let examType = null;
    try {
      examType = await this.examTypeModel.exists({ _id: id });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!examType) {
      throw new NotFoundException('Tipo de exame não encontrado');
    }
  }

  async examTypeAlreadyExists(name: string) {
    let examType = null;
    try {
      // Use uma expressão regular case-sensitive para a comparação
      examType = await this.examTypeModel.exists({
        name: { $regex: new RegExp(`^${name}$`) },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (examType) {
      throw new BadRequestException('Tipo de exame já foi cadastrado.');
    }
  }
}
