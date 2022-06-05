import { Module } from '@nestjs/common';
import { EventStore } from './core/eventStore';
import { EventStoreController } from './eventStore.controller';

@Module({
  exports: [EventStore],
  controllers: [EventStoreController],
  providers: [
    EventStore,
  ],
})
export class EventStoreModule {}
