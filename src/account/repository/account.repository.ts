import { Injectable, Logger } from '@nestjs/common';
import { EventStore } from '../../eventStore/core/eventStore';
import { DomainEvent } from '../events/impl';
import { Account } from '../models/account.model';

const groupBy = <T>(array: T[], predicate: (v: T) => string) =>
  array.reduce((acc, value) => {
    (acc[predicate(value)] ||= []).push(value);
    return acc;
  }, {} as { [key: string]: T[] });

@Injectable()
export class AccountRepository {
  constructor(
    private readonly eventStore: EventStore,
  ) {}

  protected readonly logger = new Logger(AccountRepository.name);

  findOneById(accountId: string, userId: string): Account | null {
    const events = this.eventStore.getEvents(accountId);

    if (events.length === 0) {
      return null;
    }

    this.logger.log(`Found ${events.length} events with streamId ${accountId}`);
    let account = new Account(accountId, userId);
    events.forEach(event => account.applyEvent(event));
    return account;
  }

  getAllAccounts(userId: string): Account[] {
    const events = this.eventStore.getEventsByRowId(userId, 'accountAggregate');
    const eventsByAccountIds = groupBy<DomainEvent>(events, (e) => e.accountId);
    const accounts = Object.keys(eventsByAccountIds)
      .map(accountId => {
        let account = new Account(accountId, userId);
        const events = eventsByAccountIds[accountId];
        events.forEach(event => account.applyEvent(event));
        return account;
      })
      .filter(account => account.isAccountActive());

    return accounts;
  }
}
