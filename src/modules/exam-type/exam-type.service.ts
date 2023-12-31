import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateExamTypeDTO } from './dto/create-exam-type.dto';
import { UpdateExamTypeDTO } from './dto/update-exam-type.dto';
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
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      return await this.examTypeModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: Types.ObjectId) {
    // verifica se o tipo de exame existe
    await this.examTypeExists(id);

    try {
      return await this.examTypeModel.findById(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByName(name: string) {
    try {
      // Use uma expressão regular case-insensitive para a consulta
      return await this.examTypeModel
        .findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: Types.ObjectId, data: UpdateExamTypeDTO) {
    let examType = null;
    try {
      examType = await this.examTypeModel.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!examType) {
      throw new BadRequestException('Tipo de exame não encontrado.');
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
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: Types.ObjectId) {
    // verifica se o tipo de exame existe
    await this.examTypeExists(id);

    try {
      return await this.examTypeModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async examTypeExists(id: Types.ObjectId) {
    let examType = null;
    try {
      examType = await this.examTypeModel.exists({ _id: id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!examType) {
      throw new NotFoundException('Tipo de exame não encontrado.');
    }
  }

  async examTypeExistsByName(name: string) {
    let examType = null;
    try {
      examType = await this.examTypeModel.exists({ name });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!examType) {
      throw new NotFoundException('Tipo de exame não encontrado.');
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
      throw new InternalServerErrorException(error.message);
    }

    if (examType) {
      throw new BadRequestException('Tipo de exame já foi cadastrado.');
    }
  }
}
