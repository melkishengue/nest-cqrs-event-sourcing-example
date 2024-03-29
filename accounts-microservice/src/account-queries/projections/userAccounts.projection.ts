// this example projection responds to the query of getting
// all accounts of a user and their resp. activity

import { Injectable } from "@nestjs/common";
import { MoneyDto } from "../../account/dto";
import {
  AccountCreatedEvent,
  AccountCreditedEvent,
  AccountDebitedEvent,
  AccountUpdatedEvent,
  AccountDeletedEvent,
} from "../../account/events/impl";
import { Money } from "../../account/value-objects";
import { EnhancedDomainEvent, EventStore, EventStoreEventHandler } from "../../eventStore/core/eventStore";
import { UserAccountRepository } from "../repositories/userAccounts.repository";

@Injectable()
export class UserAccountsProjection implements EventStoreEventHandler {
  eventIds: number[] = [];
  eventTypesOfInterest = [
    AccountCreatedEvent.name,
    AccountDeletedEvent.name,
    AccountDebitedEvent.name,
    AccountCreditedEvent.name,
    AccountUpdatedEvent.name
  ];

  constructor(
    private readonly eventStore: EventStore,
    private readonly userAccountRepo: UserAccountRepository
  ) {
    this.eventStore.subscribeToStream('*', this);

    // recreating projection at start up
    this.createProjection();
  }

  /**
   * 
   * @param { EnhancedDomainEvent } event 
   * @returns
   */
  handle(event: EnhancedDomainEvent) {
    if (this.eventIds.includes(event.version)) {
      // abort if event has already been processed
      return;
    }

    const eventType = event?.event?.type;
    if (!this.eventTypesOfInterest.includes(eventType)) {
      return;
    }

    const methodName = `handle${eventType}`;

    if (!this[methodName]) {
      return;
    }

    this[methodName](event);
  }

  handleAccountUpdatedEvent(event: EnhancedDomainEvent<AccountUpdatedEvent>) {
    const { accountId, userId, balance, creationDate, currency } = event.event;
    const account = this.userAccountRepo.findOneById(userId, accountId);

    if (balance) {
      const currentBalance = Money
        .fromDto(balance as MoneyDto);
      account.balance = { currency: currentBalance.getCurrency(), amount: currentBalance.getAmount() };
    }

    if (currency) {
      const currentBalance = Money
        .convertToCurrency(Money.fromDto(account.balance as MoneyDto), currency);
      account.balance = { currency: currentBalance.getCurrency(), amount: currentBalance.getAmount() };
    }
    
    account.operations.push({
      type: 'BALANCE_UPDATE',
      amount: balance,
      newBalance: account.balance,
      date: creationDate,
      senderId: '-'
    });

    this.userAccountRepo.save(userId, account);
    this.eventIds.push(event.version);
  }

  handleAccountCreatedEvent(event: EnhancedDomainEvent<AccountCreatedEvent>): void {
    const { accountId, balance, creationDate, userId } = event.event;
    this.userAccountRepo.save(userId, {
      accountId,
      balance,
      creationDate,
      operations: [],
      isDeleted: false,
    });
    this.eventIds.push(event.version);
  }

  handleAccountCreditedEvent(event: EnhancedDomainEvent<AccountCreditedEvent>): void {
    const { accountId, userId, money, creationDate, senderAccountId } = event.event;
    const account = this.userAccountRepo.findOneById(userId, accountId);
    
    const currentBalance = Money
      .fromDto(account.balance as MoneyDto)
      .increaseAmount(Money.fromDto(money));
    account.balance = { currency: currentBalance.getCurrency(), amount: currentBalance.getAmount() };

    account.operations.push({
      type: 'DEPOSIT',
      amount: money,
      newBalance: account.balance,
      date: creationDate,
      senderId: senderAccountId
    });

    this.userAccountRepo.save(userId, account);
    this.eventIds.push(event.version);
  }

  handleAccountDebitedEvent(event: EnhancedDomainEvent<AccountDebitedEvent>): void {
    const { accountId, userId, money, creationDate, receiverAccountId } = event.event;
    const account = this.userAccountRepo.findOneById(userId, accountId);
    const currentBalance = Money
      .fromDto(account.balance as MoneyDto)
      .decreaseAmount(Money.fromDto(money));
    account.balance = { currency: currentBalance.getCurrency(), amount: currentBalance.getAmount() };

    account.operations.push({
      type: 'WITHDRAWAL',
      amount: money,
      newBalance: account.balance,
      date: creationDate,
      receiverId: receiverAccountId
    });

    this.userAccountRepo.save(userId, account);
    this.eventIds.push(event.version);
  }

  handleAccountDeletedEvent(event: EnhancedDomainEvent<AccountDeletedEvent>): void {
    const { accountId, userId, creationDate } = event.event;
    this.userAccountRepo.delete(userId, accountId);
    this.eventIds.push(event.version);
  }

  createProjection() {
    this.eventStore.getAllEvents(this);
  }
}
