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
import { ProjectType } from '../shared/interfaces/project/gql/project.type';
import { Project } from '@prisma/client';
import { CreateProjectsInput } from '../shared/interfaces/project/dto/create-projects.input';
import { PubSub } from 'graphql-subscriptions';
import { MicroServiceAuthGuard } from '../shared/decorator/microservice.auth.guard';
import { GqlContext } from '../shared/interfaces/context.interface';

const pubSub = new PubSub();

@UseGuards(MicroServiceAuthGuard)

@Resolver(() => ProjectType)
export class ProjectsResolver {
  constructor(
    private readonly projectsService: ProjectsService,
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
