import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ProjectType {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => Int)
  userId: number; // Optional: to include userId in the response
}
