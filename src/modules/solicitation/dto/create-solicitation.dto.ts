import { IsEnum, IsNotEmpty, IsObject } from 'class-validator';
import { CreateDatabaseDTO } from 'src/modules/database/dto/create-database.dto';
import { SolicitationType } from '../../../enum/solicitationType.enum';
import { CreateUserDTO } from '../../../modules/user/dto/create-user.dto';

export class CreateSolicitationDTO {
  @IsEnum(SolicitationType)
  @IsNotEmpty()
  type: SolicitationType;

  @IsObject()
  @IsNotEmpty()
  data: CreateUserDTO | CreateDatabaseDTO;
}
