import { Module, Global } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Global() // Mark this module as global
@Module({
  providers: [
    {
      provide: PubSub,
      useValue: new PubSub(), // Create a new PubSub instance
    },
  ],
  exports: [PubSub], // Export the PubSub instance
})
export class GraphQLSubscribeModule {}