import { Injectable, Inject  } from '@nestjs/common';
import { Producer } from 'kafkajs';

import {
  KAFKA_CLIENT_ID,
  KAFKA_TOPIC,
  KAFKA_BROKER,
  KAFKA_CONNECTION_TIMEOUT,
  KAFKA_AUTHENTICATION_TIMEOUT,
  KAFKA_REAUTHENTICATION_THRESHOLD,
} from './constant';

@Injectable()
export class KafkaProducerService{

  constructor(@Inject('KAFKA_PRODUCER') private readonly producer: Producer) {
  }

  public async send(messages: object): Promise<void> {
    await this.producer.send({
      topic: KAFKA_TOPIC,
      messages: [{ value: JSON.stringify(messages) }],
    });
  }
}
