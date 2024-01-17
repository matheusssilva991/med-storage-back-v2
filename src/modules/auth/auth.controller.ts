import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDto) {
    const token = await this.authService.login(email, password);
    return {
      message: 'success',
      accessToken: token.accessToken,
    };
  }
}
