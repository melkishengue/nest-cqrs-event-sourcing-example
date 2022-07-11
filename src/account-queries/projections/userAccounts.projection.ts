// this example projection responds to the query of getting
// all accounts of a user

import { Injectable } from "@nestjs/common";
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
    'AccountCreditedEvent'
  ];

  constructor(
    private readonly eventStore: EventStore,
    private readonly userAccountRepo: UserAccountRepository
  ) {
    this.eventStore.subscribeToStream('*', this);

    this.createProjection();
  }

  handle(event) {
    if (this.eventIds.includes(event.version)) {
      // abort if event has been already been processed
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
      .create(account.balance.amount, account.balance.currency as Currency)
      .increaseAmount(Money.create(money.amount, money.currency));
    account.balance = { currency: currentBalance.getCurrency(), amount: currentBalance.getAmount() };

    account.operations.push({
      type: 'PLUS',
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
      .create(account.balance.amount, account.balance.currency as Currency)
      .decreaseAmount(Money.create(money.amount, money.currency));
    account.balance = { currency: currentBalance.getCurrency(), amount: currentBalance.getAmount() };

    account.operations.push({
      type: 'MINUS',
      newBalance: account.balance,
      date: creationDate,
      receiverId: receiverAccountId
    });

    this.userAccountRepo.save(userId, account);
    this.eventIds.push(event.version);
  }

  createProjection() {
    // recreating projection at start up
    this.eventStore.getAllEvents(this);
  }
}
