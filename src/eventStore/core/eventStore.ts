import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DomainEvent } from "../../account/events/impl";

@Injectable()
export class EventStore implements OnModuleInit {
  streams: Record<string, { events: { event: DomainEvent, createdAt: Date }[] }> = {};
  
  protected readonly DB_PATH = resolve(__dirname, 'events.json');
  protected readonly logger = new Logger(EventStore.name);

  onModuleInit() {
    try {
      const eventsData = readFileSync(this.DB_PATH, 'utf-8');
      this.streams = JSON.parse(eventsData);
    } catch (error) {
      this.logger.warn(`File ${this.DB_PATH} was not found. It will be created at the first insert`);
    }

    // persist events to database every 3 seconds
    setInterval(() => this.flushIntoDatabase(), 3000);
  }
  
  saveEvent(streamId: string, event: DomainEvent, aggregateName: string): void {
    const content = { event, createdAt: new Date() };
    this.logger.log(`Saving event: ${JSON.stringify(content)}`);
    const _streamId = `${streamId}:${aggregateName}`;
    const stream = this.streams[_streamId];
    if (!stream?.events) {
      this.streams[_streamId] = { events: [content] };
      return;
    }
    
    stream.events.push(content);
  }

  getEvents(streamId: string, aggregateName: string): DomainEvent[] {
    const _streamId = `${streamId}:${aggregateName}`;
    return this.streams?.[_streamId]?.events?.map(e => e.event) || [];
  }

  flushIntoDatabase(): void {
    // 🖕 event-loop
    writeFileSync(this.DB_PATH, JSON.stringify(this.streams));
  }
}
