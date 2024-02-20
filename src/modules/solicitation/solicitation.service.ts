import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import { Model, Types } from 'mongoose';
import { SolicitationStatus } from '../../enum/solicitationStatus.enum';
import { SolicitationType } from '../../enum/solicitationType.enum';
import { DatabaseService } from '../database/database.service';
import { CreateDatabaseDto } from '../database/dto/create-database.dto';
import { ExamTypeService } from '../exam-type/exam-type.service';
import { ImageTypeService } from '../image-type/image-type.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { CreateSolicitationDto } from './dto/create-solicitation.dto';
import { SolicitationFilterDto } from './dto/solicitation-filter.dto';
import { UpdateSolicitationDto } from './dto/update-solicitation.dto';
import { Solicitation } from './schema/solicitation.schema';

@Injectable()
export class SolicitationService {
  constructor(
    @InjectModel('solicitation') private solicitationModel: Model<Solicitation>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly databaseService: DatabaseService,
    private readonly imageTypeService: ImageTypeService,
    private readonly examTypeService: ExamTypeService,
  ) {}

  async create(createSolicitationDto: CreateSolicitationDto) {
    let dto: CreateUserDto | CreateDatabaseDto;

    // Verifica se o tipo da solicitação é de novo usuário
    if (createSolicitationDto.type === SolicitationType.NewUser) {
      dto = new CreateUserDto();
      Object.assign(dto, createSolicitationDto.data);

      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new BadRequestException(
          errors
            .map((error) => error.constraints)
            .map((error) => Object.values(error))
            .flat(),
        );
      }

      // Verifica se já existe usuário com esse email
      await this.userService.emailAlreadyExists(
        createSolicitationDto.data['email'],
      );

      // Verifica se já existe solicitação de cadastro com esse email
      await this.solicitationEmailAlreadyExists(
        createSolicitationDto.data['email'],
      );

      // Cripitografar a senha do usuário se o tipo da solicitação for NewUser
      const { password } = createSolicitationDto.data as CreateUserDto;
      const salt = await bcrypt.genSalt(10);
      createSolicitationDto.data['password'] = await bcrypt.hash(
        password,
        salt,
      );

      // Verifica se o tipo da solicitação é de novo banco de dados
    } else if (createSolicitationDto.type === SolicitationType.NewDatabase) {
      dto = new CreateDatabaseDto();
      Object.assign(dto, createSolicitationDto.data);

      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new BadRequestException(
          errors
            .map((error) => error.constraints)
            .map((error) => Object.values(error))
            .flat(),
        );
      }

      // Verifica se já existe banco de dados com esse nome
      await this.databaseService.databaseAlreadyExists(
        createSolicitationDto.data['name'],
      );

      // Verifica se já existe solicitação de banco de dados com esse nome
      await this.solicitationDatabaseAlreadyExists(
        createSolicitationDto.data['name'],
      );

      // Verifica se o tipo de imagem e o tipo de exame existem
      await this.imageTypeService.findOne(
        createSolicitationDto.data['imageType'],
      );
      await this.examTypeService.findOne(
        createSolicitationDto.data['examType'],
      );
    }

    // Definir data da solicitação como agora
    createSolicitationDto['solicitationDate'] = new Date();

    // Definir status da solicitação como pendente
    createSolicitationDto['status'] = SolicitationStatus.Pending;

    // Cria a nova solicitação e salva ela no banco de dados
    const solicitation = new this.solicitationModel(createSolicitationDto);
    await solicitation.save();

    // Deleta a senha do usuário da resposta se o tipo da solicitação for NewUser
    if (createSolicitationDto.type === SolicitationType.NewUser) {
      const rest = solicitation.toObject();
      delete rest.data['password'];
      return rest;
    }

    return solicitation.toObject();
  }

  async findAll() {
    // Busca todas as solicitações no banco de dados
    const solicitations = await this.solicitationModel
      .find()
      .sort('createdAt')
      .exec();

    // Retorna todas as solicitações sem as senhas dos usuários
    return this.excludeSolicitationsPassword(solicitations);
  }

  async findAllWithFilter(query: SolicitationFilterDto) {
    const { type, name, status, page, limit, sort } = query;

    const filter = {
      ...(name && { 'data.name': { $regex: name, $options: 'i' } }),
      ...(type && { type: { $regex: type, $options: 'i' } }),
      ...(status && { status: { $regex: status, $options: 'i' } }),
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

    // Busca as solicitações no banco de dados
    const solicitations = await this.solicitationModel
      .find({ ...filter }, {}, { skip, limit })
      .sort(sortObject)
      .exec();

    // Retorna as solicitações sem as senhas dos usuários
    return this.excludeSolicitationsPassword(solicitations);
  }

  async findOne(id: Types.ObjectId) {
    // Busca a solicitação no banco de dados
    const solicitation = await this.solicitationModel.findById(id).exec();

    // Verifica se a solicitação existe
    if (!solicitation) {
      throw new NotFoundException('Solicitação não encontrada.');
    }

    // Retorna a solicitação sem a senha do usuário
    return this.excludeSolicitationsPassword([solicitation]);
  }

  async update(
    id: Types.ObjectId,
    updateSolicitationDto: UpdateSolicitationDto,
  ) {
    // Verifica se a solicitação existe
    await this.findOne(id);

    // Atualiza a solicitação no banco de dados
    const solicitation = await this.solicitationModel
      .findByIdAndUpdate({ _id: id }, updateSolicitationDto, { new: true })
      .exec();

    // Retorna a solicitação sem a senha do usuário
    return this.excludeSolicitationsPassword([solicitation]);
  }

  async remove(id: Types.ObjectId) {
    // Deleta a solicitação do banco de dados
    const solicitation = await this.solicitationModel
      .findByIdAndDelete(id)
      .exec();

    // Verifica se a solicitação existe
    if (!solicitation) {
      throw new NotFoundException('Solicitação não encontrada.');
    }

    return this.excludeSolicitationsPassword([solicitation]);
  }

  async solicitationEmailAlreadyExists(email: string) {
    const solicitation = await this.solicitationModel.exists({
      type: SolicitationType.NewUser,
      'data.email': email,
      status: SolicitationStatus.Pending,
    });

    if (solicitation) {
      throw new BadRequestException(
        'Já existe solicitação de cadastro de usuário com esse email',
      );
    }
  }

  async solicitationDatabaseAlreadyExists(name: string) {
    const solicitation = await this.solicitationModel.exists({
      type: SolicitationType.NewDatabase,
      'data.name': name,
    });

    if (solicitation) {
      throw new BadRequestException(
        'Já existe solicitação de cadastro de banco de imagens com esse nome',
      );
    }
  }

  excludeSolicitationsPassword(solicitations: any) {
    return solicitations.map((solicitation) => {
      if (solicitation.type === SolicitationType.NewUser) {
        const rest = solicitation.toObject();
        delete rest.data['password'];
        return rest;
      }

      return solicitation.toObject();
    });
  }
}
