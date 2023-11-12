import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserBySolicitationDTO {
  @IsMongoId()
  @IsNotEmpty()
  solicitationId: Types.ObjectId;
}
