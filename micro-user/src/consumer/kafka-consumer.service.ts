// kafka-consumer.service.ts
import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { KAFKA_CLIENT_ID, KAFKA_BROKER, KAFKA_CONSUMER_GROUP, PROJECT_CREATED_TOPIC } from './constant';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private consumer: Consumer;
  
  constructor(@Inject(PubSub) private readonly graphqlSubscription: PubSub) {}
  async onModuleInit() {
    const kafka = new Kafka({
      clientId: KAFKA_CLIENT_ID, // Replace with your application name
      brokers: [KAFKA_BROKER], // Replace with your broker address
    });

    this.consumer = kafka.consumer({ groupId: KAFKA_CONSUMER_GROUP }); // Set your consumer group ID

    await this.consumer.connect();
    await this.consumer.subscribe({ topic: PROJECT_CREATED_TOPIC, fromBeginning: true }); // Replace with your Kafka topic

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        // Handle the incoming message here
        if(topic === PROJECT_CREATED_TOPIC) {
            this.logger.log('topic is: ' + JSON.parse(message.value.toString()))
            this.graphqlSubscription.publish('projectCreated', { projectCreated: JSON.parse(message.value.toString()) });

        }
        this.logger.log(`Received message: ${message.value.toString()}`);
      },
    });
  }
}