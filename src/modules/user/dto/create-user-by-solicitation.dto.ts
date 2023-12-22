import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserBySolicitationDTO {
  @IsMongoId({ message: 'O id da solicitação é inválido.' })
  @IsNotEmpty({ message: 'O id da solicitação é obrigatório.' })
  solicitationId: Types.ObjectId;
}
