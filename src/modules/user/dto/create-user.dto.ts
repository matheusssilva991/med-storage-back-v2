import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../../../enum/userRole.enum';

export class CreateUserDto {
  @IsString({ message: 'Nome deve ser uma string.' })
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string.' })
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
    },
    { message: 'Senha é fraca.' },
  )
  password: string;

  @IsString({ message: 'Instituição deve ser uma string.' })
  @IsNotEmpty({ message: 'Instituição é obrigatória.' })
  institution: string;

  @IsString({ message: 'País deve ser uma string.' })
  @IsNotEmpty({ message: 'País é obrigatório.' })
  country: string;

  @IsString({ message: 'Cidade deve ser uma string.' })
  @IsOptional({ message: 'Cidade é opcional.' })
  city: string;

  @IsString({ message: 'Lattes deve ser uma string.' })
  @IsOptional({ message: 'Link do lattes é opcional.' })
  lattes: string;

  @IsEnum(UserRole, { message: 'Cargo do usuário é inválido.' })
  @IsOptional({ message: 'Cargo do usuário é opcional.' })
  role: UserRole;

  @IsEmpty({ message: 'Data de criação é gerada automaticamente.' })
  createdAt: Date;

  @IsEmpty({ message: 'Data de atualização é gerada automaticamente.' })
  updatedAt: Date;
}
