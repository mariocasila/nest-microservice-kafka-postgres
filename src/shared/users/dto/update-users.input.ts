import { Field, Int, InputType } from '@nestjs/graphql';
import { CreateUsersInput } from './create-users.input';

@InputType()
export class UpdateUsersInput extends CreateUsersInput {
  @Field(() => Int, { description: 'User Id' })
  id: number;
}
