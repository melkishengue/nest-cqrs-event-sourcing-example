import { v4 as uuid } from 'uuid';
import { BadRequestException, ForbiddenException, Logger, MethodNotAllowedException } from '@nestjs/common';
import {
  AccountCreatedEvent,
  AccountCreditedEvent,
  AccountCreditFailedEvent, 
  AccountDebitedEvent
} from '../events/impl';
import { Currency, Money } from '../value-objects/';
import { AccountUpdatedEvent, AccountDeletedEvent } from '../events/impl/';
import { AccountAggregateRoot } from './accountAggregateRoot';

export class Account extends AccountAggregateRoot {
  constructor(private id: string, private userId: string) {
    super();
  }

  protected readonly logger = new Logger(Account.name);
  private isDeleted: boolean = false;
  private money: Money;
  private lastUpdatedAt: string;
  private createdAt: string;

  isAccountActive(): boolean {
    return !this.isDeleted;
  }

  createAccount(userAccounts: Account[], currency: Currency, balance: Money) {
    if (userAccounts && userAccounts.length >= 12) {
      // Business rule: no user should have more than 2 accounts
      throw new ForbiddenException(`User ${this.userId} already has ${userAccounts.length} accounts!`);
    }

    const accountId = uuid();
    this.apply(new AccountCreatedEvent(
      accountId,
      this.userId,
      currency,
      { amount: balance.getAmount(), currency: balance.getCurrency() },
      (new Date()).toISOString()));
  }

  updateAccount(accountId: string, userId: string, currency?: Currency, balance?: Money) {
    if (currency && !(Object.values(Currency).includes(currency))) {
      throw new BadRequestException(`Unknown currency ${currency}`);
    }

    if (balance && balance.getAmount() < 0) {
      throw new BadRequestException(`Cannot set balance to negative value`);
    }

    this.apply(new AccountUpdatedEvent(
      this.userId,
      this.id,
      currency,
      { amount: balance.getAmount(), currency: balance.getCurrency() },
      (new Date()).toISOString()));
  }

  deleteAccount() {
    if (this.isDeleted) {
      throw new BadRequestException(`Account ${this.id} has been deleted`);
    }

    this.apply(new AccountDeletedEvent(this.userId, this.id, (new Date()).toISOString()));
  }

  debitAccount(receiverAccountId: string, money: Money) {
    if (!this.money.canBeDecreasedOf(money)) {
      throw new MethodNotAllowedException('Your credit is not enough to perform this operation');
    }

    if (this.isDeleted) {
      throw new MethodNotAllowedException(`Account ${this.id} has been deleted`);
    }

    this.apply(new AccountDebitedEvent(
      this.userId,
      this.id,
      receiverAccountId,
      { amount: money.getAmount(), currency: money.getCurrency() },
      (new Date()).toISOString()));
  }

  creditAccount(senderAccountId: string, money: Money) {
    // transaction fails with 20% probability
    const transactionFailed = Math.random() < 0.2;
    if (transactionFailed) {
      this.logger.error('Fund transfer failed. Transaction needs to be rollbacked');
      this.apply(new AccountCreditFailedEvent(
        this.userId,
        senderAccountId,
        this.id ,
        { amount: money.getAmount(), currency: money.getCurrency() },
        (new Date()).toISOString()));
      return;
    }
    
    if (this.isDeleted) {
      this.logger.error(`Account ${this.id} has been deleted`);
      this.apply(new AccountCreditFailedEvent(
        this.userId,
        senderAccountId,
        this.id ,
        { amount: money.getAmount(), currency: money.getCurrency() },
        (new Date()).toISOString()));
      return;
    }

    this.apply(new AccountCreditedEvent(
      this.userId,
      this.id,
      { amount: money.getAmount(), currency: money.getCurrency() },
      (new Date()).toISOString()));
  }

  onAccountCreatedEvent(event: AccountCreatedEvent): void {
    this.id = event.accountId;
    this.money = Money.create(event.balance.amount, event.balance.currency);
    this.isDeleted = false;
    this.createdAt = event.creationDate;
    this.lastUpdatedAt = event.creationDate;
  }

  onAccountUpdatedEvent(event: AccountUpdatedEvent): void {
    if (event.currency) {
      this.money = Money.convertToCurrency(this.money, event.currency);
    }

    if (event.balance) {
      this.money = Money.create(event.balance.amount, event.balance.currency);
    }

    this.lastUpdatedAt = event.creationDate;
  }

  onAccountDeletedEvent(event: AccountDeletedEvent): void {
    this.isDeleted = true;
    this.lastUpdatedAt = event.creationDate;
  }

  onAccountDebitedEvent(event: AccountDebitedEvent): void {
    const savedMoney = Money.create(event.money.amount, event.money.currency);
    this.money = this.money.decreaseAmount(savedMoney);
    this.lastUpdatedAt = event.creationDate;
  }

  onAccountCreditedEvent(event: AccountCreditedEvent): void {
    const savedMoney = Money.create(event.money.amount, event.money.currency);
    this.money = this.money.increaseAmount(savedMoney);
    this.lastUpdatedAt = event.creationDate;
  }
}
