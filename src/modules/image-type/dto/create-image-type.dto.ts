import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateImageTypeDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsObject()
  requiredData: object;

  @IsObject()
  optionalData: object;
}
