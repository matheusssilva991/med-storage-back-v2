import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateImageTypeDto {
  @IsString({ message: 'Nome do tipo de imagem deve ser uma string.' })
  @IsNotEmpty({ message: 'Nome do tipo de imagem é obrigatório.' })
  name: string;

  @IsString({ message: 'Descrição deve ser uma string.' })
  @IsNotEmpty({ message: 'Descrição é obrigatória.' })
  description: string;

  @IsObject({ message: 'Dados obrigatórios é um objeto.' })
  @IsNotEmpty({ message: 'Dados obrigatórios não pode ser vázio.' })
  requiredData: object;

  @IsObject({ message: 'Dados opcionais é um objeto.' })
  optionalData: object;
}
