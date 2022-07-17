import { createReadStream, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DomainEvent } from "../../account/events/impl";

export type EnhancedDomainEvent<T = DomainEvent> = {
  rowId: string,
  aggregateId: string,
  event: T,
  createdAt: Date,
  version: number
};

export interface EventStoreEventHandler {
  handle(event: EnhancedDomainEvent): void
}

@Injectable()
export class EventStore implements OnModuleInit {
  streams: EnhancedDomainEvent[] = [];
  handlers: Record<string, EventStoreEventHandler[]> = {};
  
  protected readonly DB_PATH = resolve('events.json');
  protected readonly logger = new Logger(EventStore.name);
  
  onModuleInit() {
    this.streams = this.loadDataFromFile();

    // persist events to database every 3 seconds
    setInterval(() => this.flushIntoDatabaseFile(), 3000);
  }
  
  saveEvent(rowId: string, aggregateId: string, event: DomainEvent, aggregateName: string): void {
    const _rowId = `${rowId}:${aggregateName}`;
    const _event: EnhancedDomainEvent = {
      rowId: _rowId,
      aggregateId,
      event,
      createdAt: new Date(),
      version: this.streams.length // TODO: version should be per stream
    };
    this.logger.log(`Saving event: ${JSON.stringify(_event)}`);
    this.streams.push(_event);
    this.notifyListeners(_event);
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

  notifyListeners(event: EnhancedDomainEvent): void {
    this.handlers['*'].forEach(handler => {
      handler.handle(event);
    });
  }

  subscribeToStream(eventType: string, handler: EventStoreEventHandler) {
    if (!this.handlers[eventType]) {
      this.handlers[eventType] = [];
    }
    
    this.handlers[eventType].push(handler);
    this.logger.debug(`Subscribed to stream ${eventType}`);
  }

  getAllEvents(handler: EventStoreEventHandler) {
    const streams = this.loadDataFromFile();
    streams.forEach(stream => handler.handle(stream));
  }

  loadDataFromFile(): EnhancedDomainEvent[] {
    try {
      const eventsData = readFileSync(this.DB_PATH, 'utf-8');
      return JSON.parse(eventsData);
    } catch (error) {
      this.logger.error(`Faild to load data file ${this.DB_PATH}.`);
      return [];
    }
  }

  flushIntoDatabaseFile(): void {
    // 🖕 event-loop
    writeFileSync(this.DB_PATH, JSON.stringify(this.streams, null, 4));
  }
}
