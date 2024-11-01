import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';

@InputType()
export class CreateProjectsInput {
  // @Field(() => Int, { description: 'User Id' })
  // @IsNumber()
  // userId: number;

  @Field(() => String, { description: 'Project title' })
  @IsString()
  title: string;
}
