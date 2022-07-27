import { AggregateRoot, IEvent } from '@nestjs/cqrs';
import { DomainEvent } from '../events/impl';

export abstract class AccountAggregateRoot<
  EventBase extends IEvent = IEvent,
> extends AggregateRoot<EventBase> {
  getEventName(event: DomainEvent): string {
    // we use the type to differentiate between events
    return event.type;
  }
}
