import { IsEnum } from 'class-validator';
import { SolicitationStatus } from 'src/enum/solicitationStatus.enum';

export class UpdateSolicitationDTO {
  @IsEnum(SolicitationStatus)
  status: SolicitationStatus;
}
