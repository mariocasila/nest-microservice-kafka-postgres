import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TasksWorker } from './tasks.worker';
import { TasksService } from './tasks.service';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    BullModule.registerQueue({
      name: 'fetchProjectsQueue', // The name of the queue
    }),
    ProjectsModule,
  ],
  providers: [TasksWorker, TasksService],
})
export class TasksModule {}
