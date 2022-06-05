import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import * as clc from 'cli-color';
import { EventStore } from '../../../eventStore/core/eventStore';
import { AccountCreditedEvent } from '../impl/account-Credited.event';

@EventsHandler(AccountCreditedEvent)
export class AccountCreditedHandler implements IEventHandler<AccountCreditedEvent> {
  constructor(
    private readonly eventStore: EventStore,
  ) {}

  handle(event: AccountCreditedEvent) {
    console.log(clc.yellowBright(`Async AccountCreditedEvent`), event);
    this.eventStore.saveEvent(event.accountId, event);
  }
}
