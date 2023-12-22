import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDatabaseDTO {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  name: string;

  @IsString({ message: 'O tipo de exame deve ser uma string.' })
  @IsNotEmpty({ message: 'O tipo de exame não pode ser vazio.' })
  examType: string;

  @IsString({ message: 'A descrição deve ser uma string.' })
  @IsNotEmpty({ message: 'A descrição não pode ser vazia.' })
  description: string;

  @IsArray({ message: 'A qualidade da imagem deve ser um array.' })
  @IsNotEmpty({ message: 'A qualidade da imagem não pode ser vazia.' })
  imageQuality: Array<number>;

  @IsString({ message: 'O tipo de imagem deve ser uma string.' })
  @IsNotEmpty({ message: 'O tipo de imagem não pode ser vazio.' })
  imageType: string;

  @IsString({ message: 'A url deve ser uma string.' })
  @IsOptional({ message: 'A url é opcional.' })
  url: string;

  @IsString({ message: 'O path deve ser uma string.' })
  @IsOptional({ message: 'O caminho do banco é opcional.' })
  path: string;

  @IsArray({ message: 'As imagens devem ser um array de objetos.' })
  @IsOptional({ message: 'As imagens são opcionais.' })
  images: Array<object>;
}
