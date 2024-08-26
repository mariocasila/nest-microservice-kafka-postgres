import { Module, DynamicModule, Global } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { KafkaProducerService } from './kafka-producer.service';
import { KAFKA_AUTHENTICATION_TIMEOUT, KAFKA_CONNECTION_TIMEOUT, KAFKA_REAUTHENTICATION_THRESHOLD } from './constant';

@Global()
@Module({})
export class KafkaProducerModule {
  static forRoot({ clientId, brokers} : {clientId: string, brokers: string[]}): DynamicModule {
    const kafka = new Kafka({
      clientId, // Use a unique client ID
      brokers, // Pass brokers from arguments
      connectionTimeout: KAFKA_CONNECTION_TIMEOUT,
      authenticationTimeout: KAFKA_AUTHENTICATION_TIMEOUT,
      reauthenticationThreshold: KAFKA_REAUTHENTICATION_THRESHOLD,

    });

    return {
      module: KafkaProducerModule,
      providers: [
        {
          provide: 'KAFKA_PRODUCER', // Provide a constant key
          useFactory: async () => {
            const producer = kafka.producer();
            await producer.connect(); // Connect the producer
            return producer;
          },
        },
        KafkaProducerService,
      ],
      exports: ['KAFKA_PRODUCER', KafkaProducerService], // Export for use in other modules
    };
  }  
}
