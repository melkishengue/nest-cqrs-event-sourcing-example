import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventStore } from '../../../eventStore/core/eventStore';
import { AccountCreditedEvent } from '../impl/account-credited.event';

@EventsHandler(AccountCreditedEvent)
export class AccountCreditedHandler implements IEventHandler<AccountCreditedEvent> {
  constructor(
    private readonly eventStore: EventStore,
  ) {}

  protected readonly logger = new Logger(AccountCreditedHandler.name);

  handle(event: AccountCreditedEvent) {
    this.logger.log(`AccountCreditedEvent: ${JSON.stringify(event)}`);
    this.eventStore.saveEvent(event.userId, event.accountId, event, 'accountAggregate');
  }
}
