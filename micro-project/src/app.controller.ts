import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaProducerService } from './producer/kafka-producer.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly kafkaProducerService: KafkaProducerService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  kafkaTest(): string {
    this.kafkaProducerService.send({ name: 'kafka'})
    return 'kafka test';
  }  
}
