import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserBySolicitationDto {
  @IsMongoId({ message: 'ID da solicitação é inválido.' })
  @IsNotEmpty({ message: 'ID da solicitação é obrigatório.' })
  solicitationId: Types.ObjectId;
}
