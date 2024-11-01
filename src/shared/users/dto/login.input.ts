import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String, { description: 'email', nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field(() => String, { description: 'username', nullable: true })
  @IsString()
  @IsOptional()
  username?: string;

  @Field(() => String, { description: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
