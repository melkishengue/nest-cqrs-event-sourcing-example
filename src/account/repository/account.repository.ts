import { Injectable, Logger } from '@nestjs/common';
import { EventStore } from '../../eventStore/core/eventStore';
import { Account } from '../models/account.model';

@Injectable()
export class AccountRepository {
  constructor(
    private readonly eventStore: EventStore,
  ) {}

  protected readonly logger = new Logger(AccountRepository.name);
  
  findOneById(accountId: string): Account | null {
    const events = this.eventStore.getEvents(accountId, 'accountAggregate');

    if (events.length === 0) {
      return null;
    }

    this.logger.log(`Found ${events.length} events with streamId ${accountId}`);
    let account = new Account(accountId);
    events.forEach(event => account.applyEvent(event));
    return account;
  }
}
