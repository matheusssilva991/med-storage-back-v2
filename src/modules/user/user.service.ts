import { CreateUserBySolicitationDTO } from './dto/create-user-by-solicitation.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { Solicitation } from '../solicitation/schema/solicitation.schema';
import { SolicitationType } from 'src/enum/solicitationType.enum';
import { SolicitationStatus } from 'src/enum/solicitationStatus.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    @InjectModel('solicitation') private solicitationModel: Model<Solicitation>,
  ) {}

  async createUser(data: CreateUserDTO) {
    // verifica se o email já está cadastrado
    await this.emailExists(data.email);

    try {
      // cripitografar a senha do usuário
      const { password } = data;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      data['password'] = hash;

      // cria o novo usuário e salva ele no banco de dados
      const user = new this.userModel(data);
      return await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createUserBySolicitation(data: CreateUserBySolicitationDTO) {
    let solicitation = null;
    try {
      // Tenta encontrar a solicitação no banco de dados
      solicitation = await this.solicitationModel
        .findById(data.solicitationId)
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    // verifica se a solicitação existe
    if (!solicitation) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    // verifica se a solicitação já foi atendida
    if (solicitation.status !== 'pending') {
      throw new BadRequestException('Solicitação já atendida');
    }

    // verifica se o tipo da solicitação é de usuário
    if (solicitation.type !== SolicitationType.NewUser) {
      throw new NotFoundException('Tipo de solicitação inválida.');
    }

    // verifica se o email já está cadastrado
    await this.emailExists(solicitation.data['email']);

    try {
      // cria o novo usuário e salva ele no banco de dados
      const user = new this.userModel(solicitation.data);

      if (user) {
        // Altera status da solicitação
        await this.solicitationModel.updateOne(
          {
            _id: data.solicitationId,
          },
          {
            status: SolicitationStatus.Aproved,
          },
        );
      }

      return await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUsers() {
    try {
      return await this.userModel.find({}, { password: 0 }).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserById(id: Types.ObjectId) {
    // verifica se o usuário existe
    await this.userExists(id);

    try {
      return await this.userModel.findById(id, { password: false }).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserByEmail(email: string) {
    // verifica se o email existe
    await this.emailExists(email);

    try {
      return await this.userModel
        .findOne({ email }, { password: false })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateUser(id: Types.ObjectId, data: CreateUserDTO) {
    // verifica se o usuário existe
    await this.userExists(id);

    let user = null;
    try {
      user = await this.userModel.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    // verifica se o email já está cadastrado
    if (user.email !== data.email) {
      await this.emailExists(data.email);
    }

    try {
      // Cripitografar a senha do usuário
      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(data.password, salt);
        data['password'] = hash;
      }

      // Atualiza o usuário no banco de dados
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, data, { new: true })
        .exec();

      // Retorna o usuário sem a senha
      delete updatedUser['password'];
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteUser(id: Types.ObjectId) {
    // verifica se o usuário existe
    await this.userExists(id);

    try {
      // deleta o usuário do banco de dados
      const user = await this.userModel.findByIdAndDelete(id).exec();
      delete user['password'];
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async userExists(id: Types.ObjectId) {
    let user = null;
    try {
      user = await this.userModel.exists({ _id: id });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    // se o usuário não existir, lança uma exceção
    if (!user) {
      throw new NotFoundException('Solicitação não encontrada');
    }
  }

  async emailExists(email: string) {
    let user = null;
    try {
      user = await this.userModel.exists({ email });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    // se o email já estiver cadastrado, lança uma exceção
    if (user) {
      throw new BadRequestException('Email já cadastrado');
    }
  }
}
