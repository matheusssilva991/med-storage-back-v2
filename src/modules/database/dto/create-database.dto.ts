import {
  IsArray,
  IsEmpty,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateDatabaseDto {
  @IsString({ message: 'Nome do banco de imagens deve ser uma string.' })
  @IsNotEmpty({ message: 'Nome do banco de imagens é obrigatório.' })
  name: string;

  @IsMongoId({ message: 'Tipo de exame deve ser um id válido.' })
  @IsNotEmpty({ message: 'Tipo de exame é obrigatório.' })
  examType: Types.ObjectId;

  @IsString({ message: 'Descrição deve ser uma string.' })
  @IsNotEmpty({ message: 'Descrição é obrigatória.' })
  description: string;

  @IsArray({ message: 'Qualidade da imagem deve ser um array.' })
  @IsNotEmpty({ message: 'Qualidades das imagens é obrigatório.' })
  imageQuality: Array<number>;

  @IsMongoId({ message: 'Tipo de imagem deve ser um id válido.' })
  @IsNotEmpty({ message: 'Tipo de imagem é obrigatório.' })
  imageType: Types.ObjectId;

  @IsString({ message: 'Url deve ser uma string.' })
  @IsOptional({ message: 'Url é opcional.' })
  url: string;

  @IsString({ message: 'Caminho do banco de imagens deve ser uma string.' })
  @IsOptional({ message: 'Caminho do banco de imagens é opcional.' })
  path: string;

  @IsEmpty({ message: 'As imagens é vazio.' })
  images: Array<object>;

  @IsEmpty({ message: 'Data de criação é gerada automaticamente.' })
  createdAt: Date;

  @IsEmpty({ message: 'Data de atualização é gerada automaticamente.' })
  updatedAt: Date;
}
