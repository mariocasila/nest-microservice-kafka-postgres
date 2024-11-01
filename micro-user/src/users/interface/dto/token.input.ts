import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class TokenInput {
  @Field(() => String, { description: 'Token' })
  @IsNotEmpty()
  @IsString()
  token: string;
}
