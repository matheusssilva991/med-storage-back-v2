import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateImageTypeDto {
  @IsString({ message: 'Nome do tipo de imagem deve ser uma string.' })
  @IsNotEmpty({ message: 'Nome do tipo de imagem é obrigatório.' })
  name: string;

  @IsString({ message: 'Descrição deve ser uma string.' })
  @IsNotEmpty({ message: 'Descrição é obrigatória.' })
  description: string;

  @IsArray({ message: 'Dados obrigatórios é um array.' })
  @IsNotEmpty({ message: 'Dados obrigatórios não pode ser vázio.' })
  requiredData: Array<string>;

  @IsArray({ message: 'Dados opcionais é um array.' })
  @IsOptional({ message: 'Dados opcionais é opcional.' })
  optionalData: Array<string>;

  @IsEmpty({ message: 'Data de criação é gerada automaticamente.' })
  createdAt: Date;

  @IsEmpty({ message: 'Data de atualização é gerada automaticamente.' })
  updatedAt: Date;
}
