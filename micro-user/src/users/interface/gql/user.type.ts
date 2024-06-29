import 'reflect-metadata';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => String, { nullable: true })
  bio: string;

  public static columns() {
    return {
      id: true,
      name: true,
      username: true,
      email: true,
      password: true,
      bio: true,
    };
  }
}
