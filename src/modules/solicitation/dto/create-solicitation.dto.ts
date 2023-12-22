import { IsEnum, IsNotEmpty, IsObject } from 'class-validator';
import { CreateDatabaseDTO } from 'src/modules/database/dto/create-database.dto';
import { SolicitationType } from '../../../enum/solicitationType.enum';
import { CreateUserDTO } from '../../../modules/user/dto/create-user.dto';

export class CreateSolicitationDTO {
  @IsEnum(SolicitationType, { message: 'O tipo de solicitação é inválido.' })
  @IsNotEmpty({ message: 'O tipo de solicitação é obrigatório.' })
  type: SolicitationType;

  @IsObject({ message: 'Os dados devem ser um objeto.' })
  @IsNotEmpty({ message: 'Os dados não podem ser vazios.' })
  data: CreateUserDTO | CreateDatabaseDTO;
}
