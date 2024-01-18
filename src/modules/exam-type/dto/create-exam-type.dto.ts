import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExamTypeDto {
  @IsString({ message: 'Nome do tipo de exame deve ser uma string.' })
  @IsNotEmpty({ message: 'Nome do tipo de exame é obrigatório.' })
  name: string;
}
