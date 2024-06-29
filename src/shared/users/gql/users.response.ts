import { OmitType, ObjectType } from '@nestjs/graphql';
import { UserType } from './user.type';

@ObjectType()
export class UsersResponse extends OmitType(UserType, ['password']) {}
