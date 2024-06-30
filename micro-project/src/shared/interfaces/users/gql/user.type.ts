import 'reflect-metadata';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ProjectType } from '../../project/gql/project.type';

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

  @Field(() => [ProjectType], { nullable: true }) // Add this line
  projects?: ProjectType[]; // Relationship with projects

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
