import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateImageTypeDto {
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
