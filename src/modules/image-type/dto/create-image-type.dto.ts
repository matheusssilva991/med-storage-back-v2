import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateImageTypeDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  name: string;

  @IsString({ message: 'A descrição deve ser uma string.' })
  @IsNotEmpty({ message: 'A descrição não pode ser vazia.' })
  description: string;

  @IsObject({ message: 'Os dados obrigatórios devem ser um objeto.' })
  @IsNotEmpty({ message: 'Os dados obrigatórios não podem ser vazios.' })
  requiredData: object;

  @IsObject({ message: 'Os dados opcionais devem ser um objeto.' })
  optionalData: object;
}
