import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventStore } from '../../../eventStore/core/eventStore';
import { AccountUpdatedEvent } from '../impl/account-updated.event';

@EventsHandler(AccountUpdatedEvent)
export class AccountUpdatedHandler implements IEventHandler<AccountUpdatedEvent> {
  constructor(
    private readonly eventStore: EventStore,
  ) {}

  protected readonly logger = new Logger(AccountUpdatedHandler.name);

  handle(event: AccountUpdatedEvent) {
    this.logger.log(`AccountUpdatedEvent: ${JSON.stringify(event)}`);
    this.eventStore.saveEvent(event.userId, event.accountId, event, 'accountAggregate');
  }
}
