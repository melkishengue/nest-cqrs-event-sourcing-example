import { Injectable } from "@nestjs/common";
import { AccountEvent } from "../../account/events/impl";

@Injectable()
export class EventStore {
  events: { streamId: string, event: AccountEvent }[] = [];

  saveEvent(streamId: string, event: AccountEvent): void {
    this.events.push({ streamId, event });
  }

  getEvents(streamId: string): AccountEvent[] {
    return this.events
      .filter(event => event.streamId === streamId)
      .map(event => event.event);
  }
}
