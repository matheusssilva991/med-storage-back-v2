import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (await bcrypt.compare(password, user.password)) {
      return user;
    }
    throw new UnauthorizedException('Senha incorreta.');
  }

  async createToken(user: User) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      {
        secret: process.env.SECRET_KEY,
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION),
      },
    );

    return { accessToken };
  }

  async checkToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return await this.createToken(user);
  }

  async me(token: string) {
    const user = this.jwtService.decode(token);
    delete user['password'];
    return await this.userService.findOneByEmail(user.email);
  }
}
