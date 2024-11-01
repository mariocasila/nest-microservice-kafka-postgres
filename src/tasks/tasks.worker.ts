import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { Job, Queue } from 'bullmq';

@Processor('fetchProjectsQueue')
@Injectable()
export class TasksWorker extends WorkerHost {
  //   private performJob: Job;
  constructor(
    private readonly projectsService: ProjectsService,
    @InjectQueue('fetchProjectsQueue') private projectsQueue: Queue,
  ) {
    super();
  }

  //   async process(job: Job) {
  //     const { userId } = job.data;
  //     const projects = await this.projectsService.findProjectsByUserId(userId);

  //     // Emit the projects via your subscription mechanism
  //     // You may want to use a pub/sub mechanism to inform GraphQL subscribers
  //     return projects;
  //   }

  async process(job: Job) {
    // This method will be called whenever a job is processed
    //console.log(`Processing job: ${job.id}`);

    // Your logic to handle the job
    // For example, fetching projects or performing other tasks
    //console.log(`Job data:`, job.data);
  }
}
