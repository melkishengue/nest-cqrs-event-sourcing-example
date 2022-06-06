import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventStore } from '../../../eventStore/core/eventStore';
import { AccountDeletedEvent } from '../impl/account-deleted.event';

@EventsHandler(AccountDeletedEvent)
export class AccountDeletedHandler implements IEventHandler<AccountDeletedEvent> {
  constructor(
    private readonly eventStore: EventStore,
  ) {}

  protected readonly logger = new Logger(AccountDeletedHandler.name);

  handle(event: AccountDeletedEvent) {
    this.logger.log(`AccountDeletedEvent: ${JSON.stringify(event)}`);
    this.eventStore.saveEvent(event.accountId, event, 'accountAggregate');
  }
}
