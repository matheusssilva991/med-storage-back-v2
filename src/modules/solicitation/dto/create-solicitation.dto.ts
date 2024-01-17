import { IsEnum, IsNotEmpty, IsObject } from 'class-validator';
import { CreateDatabaseDto } from 'src/modules/database/dto/create-database.dto';
import { SolicitationType } from '../../../enum/solicitationType.enum';
import { CreateUserDto } from '../../../modules/user/dto/create-user.dto';

export class CreateSolicitationDto {
  @IsEnum(SolicitationType, { message: 'O tipo de solicitação é inválido.' })
  @IsNotEmpty({ message: 'O tipo de solicitação é obrigatório.' })
  type: SolicitationType;

  @IsObject({ message: 'Os dados devem ser um objeto.' })
  @IsNotEmpty({ message: 'Os dados não podem ser vazios.' })
  data: CreateUserDto | CreateDatabaseDto;
}
