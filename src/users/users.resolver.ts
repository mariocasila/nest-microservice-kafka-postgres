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
import { UserType } from '../shared/users/gql/user.type';
import { ProjectType } from '../shared/projects/gql/project.type';
import { Project, User } from '@prisma/client';
import { ProjectsService } from '../projects/projects.service';
import { CreateUsersInput } from '../shared/users/dto/create-users.input';
import { UsersResponse } from '../shared/users/gql/users.response';
import { LoginResponse } from '../shared/users/gql/login.response';
import { LoginInput } from '../shared/users/dto/login.input';
import { AuthGuard } from './decorator/ auth.guard';
import { UseGuards } from '@nestjs/common';
import { GqlContext } from '../shared/interfaces/context.interface';
@Resolver(() => UserType)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private projectsService: ProjectsService,
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

  @UseGuards(AuthGuard)
  @ResolveField(() => [ProjectType])
  async projects(@Parent() user: User): Promise<Project[]> {
    return this.projectsService.findProjectsByUserId(user.id);
  }

  @Query(() => LoginResponse)
  async refreshToken(@Args('token') token: string) {
    return this.usersService.refreshTokens({ token });
  }
}
