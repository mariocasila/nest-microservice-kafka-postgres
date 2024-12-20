// types/context.interface.ts
import { Request } from 'express';
import { UserType } from '../interfaces/users/gql/user.type';

export interface GqlContext {
  req: Request & { user?: UserType }; // Extend Request to include user property
}
