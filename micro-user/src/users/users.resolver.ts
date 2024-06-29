import {
  Resolver,
  Query,
  Mutation,
  ResolveField,
  Args,
  Parent,
  Context,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserType } from './interface/gql/user.type';
import { Project, User } from '@prisma/client';
import { CreateUsersInput } from './interface/dto/create-users.input';
import { UsersResponse } from './interface/gql/users.response';
import { LoginResponse } from './interface/gql/login.response';
import { LoginInput } from './interface/dto/login.input';
import { AuthGuard } from './decorator/ auth.guard';
import { UseGuards } from '@nestjs/common';
import { GqlContext } from '../shared/interfaces/context.interface';
@Resolver(() => UserType)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Query(() => LoginResponse)
  async logIn(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    return this.usersService.login(loginInput);
  }

  @Mutation(() => UserType)
  async createUser(
    @Args('createUsersInput') createUsersInput: CreateUsersInput,
  ): Promise<UsersResponse> {
    return this.usersService.createUser(createUsersInput);
  }

  @Query(() => UsersResponse)
  async meByToken(@Args('token') token: string): Promise<UsersResponse> {
    return this.usersService.getUserByToken(token);
  }

  @UseGuards(AuthGuard)
  @Query(() => UserType)
  async me(@Context() context: GqlContext) {
    return context.req.user;
  }

  @UseGuards(AuthGuard)
  @Query(() => [UserType])
  async users(): Promise<Omit<User, 'password'>[]> {
    return this.usersService.findAllUsers();
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UserType)
  async deleteUser(@Context() context: GqlContext) {
    return this.usersService.deleteUser(context.req.user.id);
  }

  @Query(() => LoginResponse)
  async refreshToken(@Args('token') token: string) {
    return this.usersService.refreshTokens({ token });
  }
}
