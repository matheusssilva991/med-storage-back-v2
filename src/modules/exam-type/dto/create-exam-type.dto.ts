import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExamTypeDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
