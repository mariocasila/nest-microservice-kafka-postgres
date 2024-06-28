import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateUsersInput {
  @Field(() => String, { description: 'Name' })
  @IsString()
  @MaxLength(30)
  name: string;

  @Field(() => String, { description: 'username' })
  @IsString()
  @MaxLength(30)
  username: string;

  @Field(() => String, { description: 'Password' })
  @IsString()
  @MaxLength(60)
  @IsNotEmpty()
  password: string;

  @Field(() => String, { description: 'email' })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  @MaxLength(30)
  email: string;

  @Field(() => String, { description: 'Bio', nullable: true })
  @IsString()
  @MaxLength(60)
  @IsOptional()
  bio?: string;
}
