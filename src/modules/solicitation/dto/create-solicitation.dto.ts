import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { SolicitationType } from 'src/enum/solicitationType.enum';
import { CreateUserDTO } from 'src/modules/user/dto/create-user.dto';

export class CreateSolicitationDTO {
  @IsEnum(SolicitationType)
  @IsNotEmpty()
  type: SolicitationType;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserDTO)
  data: CreateUserDTO;
}
