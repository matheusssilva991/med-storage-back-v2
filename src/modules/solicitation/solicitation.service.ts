import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { SolicitationStatus } from 'src/enum/solicitationStatus.enum';
import { SolicitationType } from 'src/enum/solicitationType.enum';
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
  ) {}

  async createSolicitation(data: CreateSolicitationDTO) {
    // Cripitografar a senha do usuário se o tipo da solicitação for NewUser
    if (data.type === SolicitationType.NewUser) {
      const { password } = data.data as CreateUserDTO;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      data.data['password'] = hash;

      // Verifica se já existe usuário com esse email
      await this.userService.emailExists(data.data['email']);

      // Verifica se já existe solicitação de cadastro com esse email
      await this.solicitationEmailExists(data.data['email']);
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
      throw new InternalServerErrorException(error);
    }
  }

  async getSolicitations() {
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
      throw new InternalServerErrorException(error);
    }
  }

  async getSolicitationById(id: Types.ObjectId) {
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
      throw new InternalServerErrorException(error);
    }
  }

  async updateSolicitation(id: Types.ObjectId, data: UpdateSolicitationDTO) {
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
      throw new InternalServerErrorException(error);
    }
  }

  async deleteSolicitation(id: Types.ObjectId) {
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
      throw new InternalServerErrorException(error);
    }
  }

  async solicitationExists(id: Types.ObjectId) {
    let solicitation = null;
    try {
      solicitation = await this.solicitationModel.exists({ _id: id });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!solicitation) {
      throw new NotFoundException('Solicitação não encontrada');
    }
  }

  async solicitationEmailExists(email: string) {
    let solicitation = null;
    try {
      solicitation = await this.solicitationModel.exists({
        type: SolicitationType.NewUser,
        'data.email': email,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (solicitation) {
      throw new NotFoundException(
        'Já existe solicitação de cadastro com esse email',
      );
    }
  }
}
