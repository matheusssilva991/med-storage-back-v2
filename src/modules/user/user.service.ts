import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { SolicitationStatus } from '../../enum/solicitationStatus.enum';
import { SolicitationType } from '../../enum/solicitationType.enum';
import { Solicitation } from '../solicitation/schema/solicitation.schema';
import { CreateUserBySolicitationDto } from './dto/create-user-by-solicitation.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    @InjectModel('solicitation') private solicitationModel: Model<Solicitation>,
  ) {}

  async create(data: CreateUserDto) {
    // verifica se o email já está cadastrado
    await this.emailAlreadyExists(data.email);

    // cripitografar a senha do usuário
    const { password } = data;
    const salt = await bcrypt.genSalt(10);
    data['password'] = await bcrypt.hash(password, salt);

    // cria o novo usuário e salva ele no banco de dados
    const user = (await new this.userModel(data).save()).toObject();
    delete user['password'];
    return user;
  }

  async createBySolicitation(data: CreateUserBySolicitationDto) {
    const solicitation = await this.solicitationModel
      .findById(data.solicitationId)
      .exec();

    // verifica se a solicitação existe
    if (!solicitation) {
      throw new NotFoundException('Solicitação não encontrada.');
    }

    // verifica se a solicitação já foi atendida
    if (solicitation.status !== 'pending') {
      throw new BadRequestException('Solicitação já atendida.');
    }

    // verifica se o tipo da solicitação é de usuário
    if (solicitation.type !== SolicitationType.NewUser) {
      throw new NotFoundException('Tipo de solicitação inválida.');
    }

    // verifica se o email já está cadastrado
    await this.emailAlreadyExists(solicitation.data['email']);

    // cria o novo usuário e salva ele no banco de dados
    const user = (
      await new this.userModel(solicitation.data).save()
    ).toObject();

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

    delete user['password'];
    return user;
  }

  async findAll() {
    return await this.userModel.find({}, { password: 0 }).exec();
  }

  async findOne(id: Types.ObjectId) {
    const user = await this.userModel.findById(id, { password: false }).exec();

    // se o usuário não existir, lança uma exceção
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();

    // se o usuário não existir, lança uma exceção
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async update(id: Types.ObjectId, data: UpdateUserDto) {
    // verifica se o usuário existe
    const user = await this.findOne(id);

    // verifica se o email já está cadastrado
    if (user.email !== data.email) {
      await this.emailAlreadyExists(data.email);
    }

    // Cripitografar a senha do usuário
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data['password'] = await bcrypt.hash(data.password, salt);
    }

    // Atualiza o usuário no banco de dados
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();

    // Retorna o usuário sem a senha
    delete updatedUser['password'];
    return updatedUser;
  }

  async remove(id: Types.ObjectId) {
    // verifica se o usuário existe
    const user = this.userModel.findOneAndDelete(id).exec();

    // se o usuário não existir, lança uma exceção
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async emailExists(email: string) {
    const user = await this.userModel.exists({ email });

    // se o email não existir, lança uma exceção
    if (!user) {
      throw new NotFoundException('Email não encontrado.');
    }
  }

  async emailAlreadyExists(email: string) {
    const user = await this.userModel.exists({ email });

    // se o email já estiver cadastrado, lança uma exceção
    if (user) {
      throw new BadRequestException('Email já cadastrado.');
    }
  }
}
