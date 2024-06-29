import { Test, TestingModule } from '@nestjs/testing';
import { TasksWorker } from './tasks.worker';
import { BullModule } from '@nestjs/bullmq';
import { ProjectsModule } from '../projects/projects.module';
import { TasksService } from './tasks.service';
import { AppModule } from '../app.module';

describe('TasksProcessor', () => {
  let provider: TasksWorker;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
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
    }).compile();

    provider = module.get<TasksWorker>(TasksWorker);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
