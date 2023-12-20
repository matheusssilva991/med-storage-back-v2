import { IsEmpty, IsEnum } from 'class-validator';
import { SolicitationStatus } from '../../../enum/solicitationStatus.enum';

export class UpdateSolicitationDTO {
  @IsEmpty()
  type: SolicitationStatus;

  @IsEmpty()
  data: object;

  @IsEnum(SolicitationStatus)
  status: SolicitationStatus;
}
