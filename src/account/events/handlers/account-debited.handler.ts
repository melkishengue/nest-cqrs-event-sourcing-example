import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import * as clc from 'cli-color';
import { EventStore } from '../../../eventStore/core/eventStore';
import { AccountDebitedEvent } from '../impl/account-debited.event';

@EventsHandler(AccountDebitedEvent)
export class AccountDebitedHandler implements IEventHandler<AccountDebitedEvent> {
  constructor(
    private readonly eventStore: EventStore,
  ) {}

  handle(event: AccountDebitedEvent) {
    console.log(clc.yellowBright(`Async AccountDebitedEvent`), event);
    this.eventStore.saveEvent(event.accountId, event);
  }
}
