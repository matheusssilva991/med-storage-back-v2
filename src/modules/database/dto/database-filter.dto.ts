import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class DatabaseFilterDto {
  @IsOptional({ message: 'Nome do banco de imagens é opcional.' })
  name: string;

  @IsOptional({ message: 'Descrição é opcional.' })
  description: string;

  @IsOptional({ message: 'Qualidade da imagem é opcional.' })
  @Transform(({ value }) => {
    const tmpValue = JSON.parse(value);
    const numericArray = tmpValue.map(Number);
    return numericArray;
  })
  imageQuality: Array<number>;

  @IsOptional({ message: 'Nome do tipo de exame é opcional.' })
  examType: string;

  @IsOptional({ message: 'Nome do tipo de imagem é opcional.' })
  imageType: string;

  @IsNumber({}, { message: 'Página deve ser um número.' })
  @IsPositive({ message: 'Página deve ser um número positivo.' })
  @Type(() => Number)
  @IsOptional({ message: 'Página é opcional.' })
  page: number;

  @IsNumber({}, { message: 'Limite deve ser um número.' })
  @IsPositive({ message: 'Limite deve ser um número positivo.' })
  @Type(() => Number)
  @IsOptional({ message: 'Limite é opcional.' })
  limit: number;

  @IsOptional({ message: 'Campo sort é opcional.' })
  sort: string;
}
