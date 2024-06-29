import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class TasksService {
  constructor(
    @InjectQueue('fetchProjectsQueue') private readonly queue: Queue,
  ) {}

  // Method to schedule a job
  async scheduleIntervalJob() {
    return;
    await this.queue.add(
      'fetchProjectsJob',
      {},
      {
        repeat: {
          every: 100000, // Schedule to run every 10 seconds
        },
      },
    );
  }
}
