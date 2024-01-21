import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class SolicitationFilterDto {
  @IsOptional({ message: 'Tipo é opcional.' })
  type: string;

  @IsOptional({ message: 'Nome é opcional.' })
  name: string;

  @IsOptional({ message: 'Status é opcional.' })
  status: string;

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

  @IsString({ message: 'Campo sort deve ser uma string.' })
  @IsOptional({ message: 'Campo sort é opcional.' })
  sort: string;
}
