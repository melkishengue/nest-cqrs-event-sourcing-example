// this example projection responds to the query of getting
// all accounts of a user and their resp. activity

import { Injectable } from "@nestjs/common";
import { MoneyDto } from "../../account/dto";
import { Currency, Money } from "../../account/value-objects";
import { EventStore } from "../../eventStore/core/eventStore";
import { UserAccountRepository } from "../repositories/userAccounts.repository";

@Injectable()
export class UserAccountsProjection {
  eventIds: string[] = [];
  eventTypesOfInterest = [
    'AccountCreatedEvent',
    'AccountDeletedEvent',
    'AccountDebitedEvent',
    'AccountCreditedEvent',
    'AccountUpdatedEvent'
  ];

  constructor(
    private readonly eventStore: EventStore,
    private readonly userAccountRepo: UserAccountRepository
  ) {
    this.eventStore.subscribeToStream('*', this);

    // recreating projection at start up
    this.createProjection();
  }

  handle(event) {
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

  handleAccountUpdatedEvent(event) {
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
      newBalance: account.balance,
      date: creationDate,
      senderId: 'xxx'
    });

    this.userAccountRepo.save(userId, account);
    this.eventIds.push(event.version);
  }

  handleAccountCreatedEvent(event): void {
    const { accountId, balance, creationDate, userId } = event.event;
    this.userAccountRepo.save(userId, {
      accountId,
      balance,
      creationDate,
      operations: []
    });
    this.eventIds.push(event.version);
  }

  handleAccountCreditedEvent(event): void {
    const { accountId, userId, money, creationDate, senderAccountId } = event.event;
    const account = this.userAccountRepo.findOneById(userId, accountId);
    
    const currentBalance = Money
      .fromDto(account.balance as MoneyDto)
      .increaseAmount(Money.fromDto(money));
    account.balance = { currency: currentBalance.getCurrency(), amount: currentBalance.getAmount() };

    account.operations.push({
      type: 'DEPOSIT',
      newBalance: account.balance,
      date: creationDate,
      senderId: senderAccountId
    });

    this.userAccountRepo.save(userId, account);
    this.eventIds.push(event.version);
  }

  handleAccountDebitedEvent(event): void {
    const { accountId, userId, money, creationDate, receiverAccountId} = event.event;
    const account = this.userAccountRepo.findOneById(userId, accountId);
    const currentBalance = Money
      .fromDto(account.balance as MoneyDto)
      .decreaseAmount(Money.fromDto(money));
    account.balance = { currency: currentBalance.getCurrency(), amount: currentBalance.getAmount() };

    account.operations.push({
      type: 'WITHDRAWAL',
      newBalance: account.balance,
      date: creationDate,
      receiverId: receiverAccountId
    });

    this.userAccountRepo.save(userId, account);
    this.eventIds.push(event.version);
  }

  createProjection() {
    this.eventStore.getAllEvents(this);
  }
}
