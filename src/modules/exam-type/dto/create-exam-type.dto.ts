import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateExamTypeDto {
  @IsString({ message: 'Nome do tipo de exame deve ser uma string.' })
  @IsNotEmpty({ message: 'Nome do tipo de exame é obrigatório.' })
  name: string;

  @IsEmpty({ message: 'Data de criação é gerada automaticamente.' })
  createdAt: Date;

  @IsEmpty({ message: 'Data de atualização é gerada automaticamente.' })
  updatedAt: Date;
}
