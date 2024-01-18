import { IsEmpty, IsEnum } from 'class-validator';
import { SolicitationStatus } from '../../../enum/solicitationStatus.enum';
import { SolicitationType } from 'src/enum/solicitationType.enum';

export class UpdateSolicitationDto {
  @IsEmpty({ message: 'Tipo de solicitação não pode ser alterado.' })
  type: SolicitationType;

  @IsEmpty({ message: 'Dados da solicitação não podem ser alterados.' })
  data: object;

  @IsEnum(SolicitationStatus, { message: 'Status da solicitação é inválido.' })
  status: SolicitationStatus;
}
