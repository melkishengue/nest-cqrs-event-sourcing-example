import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import * as clc from 'cli-color';
import { EventStore } from '../../../eventStore/core/eventStore';
import { AccountCreatedEvent } from '../impl/account-created.event';

@EventsHandler(AccountCreatedEvent)
export class AccountCreatedHandler implements IEventHandler<AccountCreatedEvent> {
  constructor(
    private readonly eventStore: EventStore,
  ) {}

  handle(event: AccountCreatedEvent) {
    console.log(clc.yellowBright(`Async AccountCreatedEvent`), event);
    this.eventStore.saveEvent(event.accountId, event);
  }
}
