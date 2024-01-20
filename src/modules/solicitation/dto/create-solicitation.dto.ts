import { IsEmpty, IsEnum, IsNotEmpty, IsObject } from 'class-validator';
import { CreateDatabaseDto } from 'src/modules/database/dto/create-database.dto';
import { SolicitationType } from '../../../enum/solicitationType.enum';
import { CreateUserDto } from '../../../modules/user/dto/create-user.dto';

export class CreateSolicitationDto {
  @IsEnum(SolicitationType, { message: 'Tipo de solicitação é inválido.' })
  @IsNotEmpty({ message: 'Tipo de solicitação é obrigatório.' })
  type: SolicitationType;

  @IsObject({ message: 'Dados da solicitação é um objeto.' })
  @IsNotEmpty({ message: 'Dados da solicitação são obrigatórios.' })
  data: CreateUserDto | CreateDatabaseDto;

  @IsEmpty({ message: 'Data de criação é gerada automaticamente.' })
  createdAt: Date;

  @IsEmpty({ message: 'Data de atualização é gerada automaticamente.' })
  updatedAt: Date;
}
