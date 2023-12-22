import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    try {
      const [, token] = authorizationHeader.split(' ');
      const data = await this.authService.checkToken(token);
      request.user = await this.userService.findOne(data.sub);

      super.canActivate(context);
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token JWT ausente');
    }
  }
}
