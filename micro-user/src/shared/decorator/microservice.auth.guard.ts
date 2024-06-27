import { CanActivate, ExecutionContext } from '@nestjs/common';
import axios from 'axios';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UsersResponse } from '../../users/interface/gql/users.response';
import { LoggerService } from '../logger/logger.service';

export class MicroServiceAuthGuard implements CanActivate {
  constructor(private readonly loggerService: LoggerService) {}

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
    const user = await this.getUserByToken(token);
    if (!user) {
      return false;
    }

    ctx.req.user = user;
    return true;
  }

  async getUserByToken(token: string): Promise<UsersResponse> {
    try {
      const query = `
      query meByToken($token:String!) {
        meByToken(token: $token) {
          id
          name
          username
          email
          bio
        }
      }
    `;

      const response = await axios.post(
        'http://localhost:3000/graphql',
        {
          query,
          variables: { token },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('response Data=', response.data.data.meByToken);
      return { ...response.data?.data?.meByToken };
    } catch (e) {
      this.loggerService.error('MicroServiceAuthGuard error', e, token);
    }
  }
}
