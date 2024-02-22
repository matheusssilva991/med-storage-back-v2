import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SolicitationStatus } from '../../enum/solicitationStatus.enum';
import { SolicitationType } from '../../enum/solicitationType.enum';
import { ExamTypeService } from '../exam-type/exam-type.service';
import { ImageTypeService } from '../image-type/image-type.service';
import { Solicitation } from '../solicitation/schema/solicitation.schema';
import { CreateDatabaseBySolicitationDto } from './dto/create-database-by-solicitation.dto';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { DatabaseFilterDto } from './dto/database-filter.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { Database } from './schema/database.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel('database') private readonly databaseModel: Model<Database>,
    @InjectModel('solicitation') private solicitationModel: Model<Solicitation>,
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

  async createBySolicitation(
    createDatabaseBySolicitationDto: CreateDatabaseBySolicitationDto,
  ) {
    const solicitation = await this.solicitationModel
      .findById(createDatabaseBySolicitationDto.solicitationId)
      .exec();
    const databaseData: any = solicitation.data;

    // verifica se a solicitação existe
    if (!solicitation) {
      throw new NotFoundException('Solicitação não encontrada.');
    }

    // verifica se a solicitação já foi atendida
    if (solicitation.status !== 'pending') {
      throw new BadRequestException('Solicitação já atendida.');
    }

    // verifica se o tipo da solicitação é de usuário
    if (solicitation.type !== SolicitationType.NewDatabase) {
      throw new NotFoundException('Tipo de solicitação inválida.');
    }

    // verifica se o banco já está cadastrado
    await this.databaseAlreadyExists(databaseData.name);

    // cria o novo usuário e salva ele no banco de dados
    const database = (
      await new this.databaseModel(solicitation.data).save()
    ).toObject();

    if (database) {
      // Altera status da solicitação
      await this.solicitationModel.updateOne(
        {
          _id: createDatabaseBySolicitationDto.solicitationId,
        },
        {
          status: SolicitationStatus.Aproved,
        },
      );
    }

    return database;
  }

  async findAll() {
    return await this.databaseModel
      .find()
      .populate('examType')
      .populate('imageType')
      .sort('createdAt')
      .exec();
  }

  async findAllWithFilter(query: DatabaseFilterDto) {
    const {
      name,
      imageQuality,
      examType,
      description,
      imageType,
      page,
      limit,
      sort,
    } = query;

    const filter = {
      ...(name && { name: { $regex: new RegExp(name, 'i') } }),
      ...(description && {
        description: { $regex: new RegExp(description, 'i') },
      }),
      ...(imageQuality && { imageQuality: { $in: imageQuality } }),
    };

    // Paginação
    const defaultLimit = limit || 10;
    const skip = page ? (page - 1) * defaultLimit : 0;

    // Ordenação
    let sortObject: string;
    try {
      sortObject = JSON.parse(sort);
    } catch (error) {
      sortObject = sort || 'createdAt';
    }

    const databases = await this.databaseModel
      .find({ ...filter }, {}, { skip, limit })
      .populate('examType')
      .populate('imageType')
      .sort(sortObject)
      .exec();

    let filteredDatabases = databases.filter((database) => {
      const regExp = new RegExp(examType, 'i');
      return database.examType.name && database.examType.name.match(regExp);
    });

    filteredDatabases = filteredDatabases.filter((database) => {
      const regExp = new RegExp(imageType, 'i');
      return database.imageType.name && database.imageType.name.match(regExp);
    });

    return filteredDatabases || databases;
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
