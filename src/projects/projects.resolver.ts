import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Subscription,
  Context,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectType } from '../shared/projects/gql/project.type';
import { UserType } from '../shared/users/gql/user.type';
import { Project } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { CreateProjectsInput } from '../shared/projects/dto/create-projects.input';
import { PubSub } from 'graphql-subscriptions';
import { MicroServiceAuthGuard } from '../shared/decorator/microservice.auth.guard';
import { GqlContext } from '../shared/interfaces/context.interface';

const pubSub = new PubSub();

@UseGuards(MicroServiceAuthGuard)
@Resolver(() => ProjectType)
export class ProjectsResolver {
  constructor(
    private readonly projectsService: ProjectsService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => ProjectType)
  async createProject(
    @Context() context: GqlContext,
    @Args('createProjectsInput') createProjectsInput: CreateProjectsInput,
  ): Promise<Project> {
    try {
      const project = this.projectsService.createProject(
        createProjectsInput.title,
        Number(context.req.user.id as number),
      );

      pubSub.publish('projectCreated', { projectCreated: project });

      return project;
    } catch (e) {
      console.error('Error creating project:', e);
      throw new Error('Could not create project');
    }
  }

  @Query(() => [ProjectType])
  async projects(): Promise<Project[]> {
    return this.projectsService.findAllProjects();
  }

  @Query(() => [ProjectType])
  async myProjects(@Context() context: GqlContext): Promise<Project[]> {
    return this.projectsService.findProjectsByUserId(
      Number(context.req.user.id),
    );
  }

  @ResolveField(() => UserType) // Resolver for the user field
  async user(@Parent() project: Project): Promise<UserType | null> {
    return this.usersService.findUserById(project.userId); // Fetch user based on userId from the project
  }

  //   @Subscription(() => ProjectType, {
  //     filter: (payload, variables) => {
  // console.log('subscription', payload);
  // console.log('subscription variables', variables);
  //       return payload.userId === variables.userId; // Only send update if userId matches
  //     },
  //   })
  @Subscription(() => ProjectType)
  projectCreated() {
    return pubSub.asyncIterator('projectCreated');
  }
}
