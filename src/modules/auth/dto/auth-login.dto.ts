import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @IsEmail({}, { message: 'Email inválido.' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @IsString({ message: 'Senha deve ser uma string.' })
  password: string;
}
