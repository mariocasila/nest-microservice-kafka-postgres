import { Module, forwardRef } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import { KafkaProducerService } from 'src/producer/kafka-producer.service';
import { KafkaProducerModule } from 'src/producer/kafka-producer.module';
import { KAFKA_BROKER, KAFKA_CLIENT_ID } from 'src/producer/constant';

@Module({
  //imports: [KafkaProducerModule],
  providers: [ProjectsService, ProjectsResolver],
  exports: [ProjectsService],
})
export class ProjectsModule {}
