import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { Exception } from '../shared/exceptions';
import { LoggerService } from '../shared/logger/logger.service';
import { KafkaProducerService } from 'src/producer/kafka-producer.service';

@Injectable()
export class ProjectsService {
  private pubSub = new PubSub();
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggerService: LoggerService,
    @Inject(KafkaProducerService)
    private readonly kafkaProducerService: KafkaProducerService,
    //private projectsQueue: Queue,
  ) {}

  async createProject(title: string, userId: number): Promise<Project> {
    try {
      const newProject = await this.prisma.project.create({
        data: {
          title,
          user: { connect: { id: userId } }, // Link to the user
        },
      });

      // // Publish the new project to subscribers
      // this.pubSub.publish('projectCreated', {
      //   projectCreated: newProject,
      //   userId,
      // });
      this.kafkaProducerService.send(newProject);

      return newProject;
    } catch (e) {
      this.loggerService.error('createProject error', e, { title, userId });
      throw new Exception(e);
    }
  }

  async findAllProjects(): Promise<Project[]> {
    return this.prisma.project.findMany();
  }

  async findProjectsByUserId(userId: number): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: {
        userId,
      },
    });
  }

  async deleteProjectByUserId(userId: number) {
    return this.prisma.project.deleteMany({ where: { userId } });
  }

  // Subscription resolver
  getProjectCreated() {
    return this.pubSub.asyncIterator('projectCreated');
  }
}
