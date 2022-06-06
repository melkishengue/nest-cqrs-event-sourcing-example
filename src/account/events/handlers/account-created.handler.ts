import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventStore } from '../../../eventStore/core/eventStore';
import { AccountCreatedEvent } from '../impl/account-created.event';

@EventsHandler(AccountCreatedEvent)
export class AccountCreatedHandler implements IEventHandler<AccountCreatedEvent> {
  constructor(
    private readonly eventStore: EventStore,
  ) {}

  protected readonly logger = new Logger(AccountCreatedHandler.name);

  handle(event: AccountCreatedEvent) {
    this.logger.log(`AccountCreatedEvent: ${JSON.stringify(event)}`);
    this.eventStore.saveEvent(event.accountId, event, 'accountAggregate');
  }
}
