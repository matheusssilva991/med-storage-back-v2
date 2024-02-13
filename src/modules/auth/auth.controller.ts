import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Request } from 'express';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDto) {
    const token = await this.authService.login(email, password);
    return {
      message: 'success',
      accessToken: token.accessToken,
    };
  }

  @Get('me')
  async me(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];

    const user = await this.authService.me(token);

    return {
      message: 'success',
      user,
    };
  }
}
