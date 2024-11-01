import { CreateProjectsInput } from './create-projects.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProjectsInput extends PartialType(CreateProjectsInput) {
  @Field(() => Int)
  id: number;
}
