import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UsersService } from '../users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const headerToken = ctx.req?.headers?.authorization;
    if (
      !headerToken ||
      headerToken.split(' ').length !== 2 ||
      headerToken.split(' ')[0] !== 'Bearer'
    ) {
      return false;
    }

    const token = headerToken.split(' ')[1];
    const user = await this.usersService.getUserByToken(token);
    if (!user) {
      return false;
    }
    ctx.req.user = user;
    return true;
  }
}
