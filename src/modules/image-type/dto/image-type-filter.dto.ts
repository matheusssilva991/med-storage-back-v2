import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class ImageTypeFilterDto {
  @IsOptional({ message: 'Nome é opcional.' })
  name: string;

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
