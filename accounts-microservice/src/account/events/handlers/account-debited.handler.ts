import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventStore } from '../../../eventStore/core/eventStore';
import { AccountDebitedEvent } from '../impl/account-debited.event';

@EventsHandler(AccountDebitedEvent)
export class AccountDebitedHandler implements IEventHandler<AccountDebitedEvent> {
  constructor(
    private readonly eventStore: EventStore,
  ) {}

  protected readonly logger = new Logger(AccountDebitedHandler.name);

  handle(event: AccountDebitedEvent) {
    this.logger.log(`AccountDebitedEvent: ${JSON.stringify(event)}`);
    this.eventStore.saveEvent(event.userId, event.accountId, event, 'accountAggregate');
  }
}
