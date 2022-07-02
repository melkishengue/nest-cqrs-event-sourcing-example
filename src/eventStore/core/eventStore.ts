import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DomainEvent } from "../../account/events/impl";

export type EnhancedDomainEvent = { rowId: string, aggregateId: string, event: DomainEvent, createdAt: Date, version: number };

@Injectable()
export class EventStore implements OnModuleInit {
  streams: EnhancedDomainEvent[] = [];
  
  protected readonly DB_PATH = resolve('events.json');
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
  
  saveEvent(rowId: string, aggregateId: string, event: DomainEvent, aggregateName: string): void {
    const _rowId = `${rowId}:${aggregateName}`;
    const _event: EnhancedDomainEvent = {
      rowId: _rowId,
      aggregateId,
      event,
      createdAt: new Date(),
      version: this.streams.length
    };
    this.logger.log(`Saving event: ${JSON.stringify(_event)}`);
    this.streams.push(_event);
  }

  getEventsByRowId(rowId: string, aggregateName: string): DomainEvent[] {
    const _rowId = `${rowId}:${aggregateName}`;
    return this.streams
      .filter(e => e.rowId === _rowId)
      .map(e => e.event);
  }

  getEvents(aggregateId: string): DomainEvent[] {
    return this.streams
      .filter(e => e.aggregateId === aggregateId)
      .map(e => e.event);
  }

  flushIntoDatabase(): void {
    // 🖕 event-loop
    writeFileSync(this.DB_PATH, JSON.stringify(this.streams, null, 4));
  }
}
