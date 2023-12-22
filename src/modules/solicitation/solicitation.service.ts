import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
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
import { CreateDatabaseDTO } from '../database/dto/create-database.dto';
import { ExamTypeService } from '../exam-type/exam-type.service';
import { ImageTypeService } from '../image-type/image-type.service';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { CreateSolicitationDTO } from './dto/create-solicitation.dto';
import { UpdateSolicitationDTO } from './dto/update-solicitation.dto';
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

  async create(data: CreateSolicitationDTO) {
    let dto: CreateUserDTO | CreateDatabaseDTO;

    // Verifica se o tipo da solicitação é de novo usuário
    if (data.type === SolicitationType.NewUser) {
      dto = new CreateUserDTO();
      Object.assign(dto, data.data);

      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new BadRequestException(
          errors
            .map((error) => error.constraints)
            .map((error) => Object.values(error))
            .flat(),
        );
      }

      // Cripitografar a senha do usuário se o tipo da solicitação for NewUser
      const { password } = data.data as CreateUserDTO;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      data.data['password'] = hash;

      // Verifica se já existe usuário com esse email
      await this.userService.emailAlreadyExists(data.data['email']);

      // Verifica se já existe solicitação de cadastro com esse email
      await this.solicitationUserEmailAlreadyExists(data.data['email']);

      // Verifica se o tipo da solicitação é de novo banco de dados
    } else if (data.type === SolicitationType.NewDatabase) {
      dto = new CreateDatabaseDTO();
      Object.assign(dto, data.data);

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
      await this.databaseService.databaseAlreadyExists(data.data['name']);

      // Verifica se já existe solicitação de banco de dados com esse nome
      await this.solicitationDatabaseAlreadyExists(data.data['name']);

      // Verifica se o tipo de imagem e o tipo de exame existem
      await this.imageTypeService.imageTypeExistsByName(data.data['imageType']);
      await this.examTypeService.examTypeExistsByName(data.data['examType']);
    }

    // Definir status como Pending
    data['status'] = SolicitationStatus.Pending;

    // Definir data da solicitação como agora
    data['solicitationDate'] = new Date();

    try {
      // Cria a nova solicitação e salva ela no banco de dados
      const solicitation = new this.solicitationModel(data);
      await solicitation.save();

      // Deleta a senha do usuário da resposta se o tipo da solicitação for NewUser
      if (data.type === SolicitationType.NewUser) {
        const rest = solicitation.toObject();
        delete rest.data['password'];
        return rest;
      }
      return solicitation.toObject();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      // Busca todas as solicitações no banco de dados
      const solicitations = await this.solicitationModel.find().exec();

      // Retorna todas as solicitações sem as senhas dos usuários
      return solicitations.map((solicitation) => {
        if (solicitation.type === SolicitationType.NewUser) {
          const rest = solicitation.toObject();
          delete rest.data['password'];
          return rest;
        }

        return solicitation.toObject();
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: Types.ObjectId) {
    // Verifica se a solicitação existe
    await this.solicitationExists(id);

    try {
      // Busca a solicitação no banco de dados
      const solicitation = await this.solicitationModel.findById(id).exec();

      // Retorna a solicitação sem a senha do usuário
      if (solicitation.type === SolicitationType.NewUser) {
        const rest = solicitation.toObject();
        delete rest.data['password'];
        return rest;
      }

      return solicitation.toObject();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: Types.ObjectId, data: UpdateSolicitationDTO) {
    // Verifica se a solicitação existe
    await this.solicitationExists(id);

    try {
      // Atualiza a solicitação no banco de dados
      const solicitation = await this.solicitationModel
        .findByIdAndUpdate({ _id: id }, data, { new: true })
        .exec();

      // Retorna a solicitação sem a senha do usuário se o tipo da solicitação for NewUser
      if (solicitation.type == SolicitationType.NewUser) {
        const rest = solicitation.toObject();
        delete rest['data']['password'];
        return rest;
      }
      return solicitation.toObject();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: Types.ObjectId) {
    // Verifica se a solicitação existe
    await this.solicitationExists(id);

    try {
      // Deleta a solicitação do banco de dados
      const solicitation = await this.solicitationModel
        .findByIdAndDelete({ _id: id }, { new: true })
        .exec();

      // Retorna a solicitação sem a senha do usuário se o tipo da solicitação for NewUser
      if (solicitation.type == SolicitationType.NewUser) {
        const rest = solicitation.toObject();
        delete rest['data']['password'];
        return rest;
      }

      return solicitation.toObject();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async solicitationExists(id: Types.ObjectId) {
    let solicitation = null;
    try {
      solicitation = await this.solicitationModel.exists({ _id: id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!solicitation) {
      throw new NotFoundException('Solicitação não encontrada.');
    }
  }

  async solicitationUserEmailAlreadyExists(email: string) {
    let solicitation = null;
    try {
      solicitation = await this.solicitationModel.exists({
        type: SolicitationType.NewUser,
        'data.email': email,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (solicitation) {
      throw new BadRequestException(
        'Já existe solicitação de cadastro de usuário com esse email',
      );
    }
  }

  async solicitationDatabaseAlreadyExists(name: string) {
    let solicitation = null;
    try {
      solicitation = await this.solicitationModel.exists({
        type: SolicitationType.NewDatabase,
        'data.name': name,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (solicitation) {
      throw new BadRequestException(
        'Já existe solicitação de cadastro de banco de imagens com esse nome',
      );
    }
  }
}
