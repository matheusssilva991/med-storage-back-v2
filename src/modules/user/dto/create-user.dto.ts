import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../../../enum/userRole.enum';

export class CreateUserDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  name: string;

  @IsEmail({}, { message: 'Email inválido.' })
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string.' })
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
    },
    { message: 'Senha fraca.' },
  )
  password: string;

  @IsString({ message: 'A instituição deve ser uma string.' })
  @IsNotEmpty({ message: 'A instituição não pode ser vazia.' })
  institution: string;

  @IsString({ message: 'O país deve ser uma string.' })
  @IsNotEmpty({ message: 'O país não pode ser vazio.' })
  country: string;

  @IsString({ message: 'O estado deve ser uma string.' })
  @IsNotEmpty({ message: 'O estado não pode ser vazio.' })
  city: string;

  @IsString({ message: 'O lattes deve ser uma string.' })
  @IsOptional({ message: 'O link do lattes é opcional.' })
  lattes: string;

  @IsEnum(UserRole, { message: 'O cargo do usuário é inválido.' })
  @IsOptional({ message: 'O cargo do usuário é opcional.' })
  role: UserRole;
}
