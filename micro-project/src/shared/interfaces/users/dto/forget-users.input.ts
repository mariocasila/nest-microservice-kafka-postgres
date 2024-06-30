import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ForgetUsersInput {
  @Field(() => String, { description: 'Email' })
  email: string;
}
