import { Body, Controller, Get } from '@nestjs/common';
import { EventStore } from './core/eventStore';

export interface GetEventsDto {
  id: string
}

@Controller('events')
export class EventStoreController {
  constructor(
    private readonly eventStore: EventStore,
  ) {}

  @Get('/')
  async getEvents(@Body() getEventsDto: GetEventsDto) {
    return this.eventStore.getEvents(getEventsDto.id);
  }
}
