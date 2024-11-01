import { Field, ObjectType } from '@nestjs/graphql';
import { UsersResponse } from './users.response';

@ObjectType()
export class LoginResponse {
  @Field(() => UsersResponse)
  user: UsersResponse;

  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}
