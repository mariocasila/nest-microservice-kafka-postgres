import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { PubSub } from 'graphql-subscriptions';
import { LoggerModule } from './shared/logger/logger.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { KafkaProducerModule } from './producer/kafka-producer.module';
import { KAFKA_BROKER, KAFKA_CLIENT_ID } from './producer/constant';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Automatically generate schema
      playground: true,
      path: `/${process.env.BACKEND_PREFIX}/graphql`,
      subscriptions: {
        'subscriptions-transport-ws': true,
        'graphql-ws': {
          path: '/graphql',
          onConnect: (connectionParams) => {
            // const authToken = connectionParams.authToken;
            // if (!isValid(authToken)) {
            //   throw new Error('Token is not valid');
            // }
            // // extract user information from token
            // const user = parseToken(authToken);
            // // return user info to add them to the context later
            // return { user };
          },
        },
      },
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev', '.env.stage', '.env.prod'],
    }),
    PrismaModule,
    ProjectsModule,
    LoggerModule,
    KafkaProducerModule.forRoot({ clientId: KAFKA_CLIENT_ID, brokers: [KAFKA_BROKER]}),
  ],
  controllers: [AppController],
  providers: [AppService, PubSub],
})
export class AppModule {}