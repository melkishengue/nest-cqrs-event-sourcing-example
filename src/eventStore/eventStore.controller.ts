import { Controller, Get, Param } from '@nestjs/common';
import { EventStore } from './core/eventStore';

@Controller('events')
export class EventStoreController {
  constructor(
    private readonly eventStore: EventStore,
  ) {}

  @Get('/:streamId')
  async getEvents(@Param('streamId') streamId: string) {
    return this.eventStore.getEvents(streamId);
  }
}
