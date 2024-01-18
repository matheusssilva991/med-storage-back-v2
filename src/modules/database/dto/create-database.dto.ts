import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDatabaseDto {
  @IsString({ message: 'Nome do banco de imagens deve ser uma string.' })
  @IsNotEmpty({ message: 'Nome do banco de imagens é obrigatório.' })
  name: string;

  @IsString({ message: 'Tipo de exame deve ser uma string.' })
  @IsNotEmpty({ message: 'Tipo de exame é obrigatório.' })
  examType: string;

  @IsString({ message: 'Descrição deve ser uma string.' })
  @IsNotEmpty({ message: 'Descrição é obrigatória.' })
  description: string;

  @IsArray({ message: 'Qualidade da imagem deve ser um array.' })
  @IsNotEmpty({ message: 'Qualidades das imagens é obrigatório.' })
  imageQuality: Array<number>;

  @IsString({ message: 'Tipo de imagem deve ser uma string.' })
  @IsNotEmpty({ message: 'Tipo de imagem é obrigatório.' })
  imageType: string;

  @IsString({ message: 'Url deve ser uma string.' })
  @IsOptional({ message: 'Url é opcional.' })
  url: string;

  @IsString({ message: 'Caminho do banco de imagens deve ser uma string.' })
  @IsOptional({ message: 'Caminho do banco de imagens é opcional.' })
  path: string;

  @IsArray({ message: 'As imagens devem ser um array de objetos.' })
  @IsEmpty({ message: 'As imagens é vazio.' })
  images: Array<object>;
}
