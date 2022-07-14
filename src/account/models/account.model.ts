import { BadRequestException, ForbiddenException, Logger, MethodNotAllowedException } from '@nestjs/common';
import {
  AccountCreatedEvent,
  AccountCreditedEvent,
  AccountCreditFailedEvent, 
  AccountDebitedEvent
} from '../events/impl';
import { Currency, Id, Money } from '../value-objects/';
import { AccountUpdatedEvent, AccountDeletedEvent } from '../events/impl/';
import { AccountAggregateRoot } from './accountAggregateRoot';

export class Account extends AccountAggregateRoot {
  constructor(private id: Id, private userId: Id) {
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

    const accountId = Id.create();
    this.apply(new AccountCreatedEvent(
      accountId.getValue(),
      this.userId.getValue(),
      currency,
      Money.toDto(balance),
      (new Date()).toISOString()));
  }

  updateAccount(accountId: Id, userId: Id, currency?: Currency, balance?: Money) {
    if (currency && !(Object.values(Currency).includes(currency))) {
      throw new BadRequestException(`Unknown currency ${currency}`);
    }

    if (balance && balance.getAmount() < 0) {
      throw new BadRequestException(`Cannot set balance to negative value`);
    }

    this.apply(new AccountUpdatedEvent(
      this.userId.getValue(),
      this.id.getValue(),
      currency,
      balance ? Money.toDto(balance) : undefined,
      (new Date()).toISOString()));
  }

  deleteAccount() {
    if (this.isDeleted) {
      throw new BadRequestException(`Account ${this.id} has been deleted`);
    }

    this.apply(new AccountDeletedEvent(
      this.userId.getValue(),
      this.id.getValue(),
      (new Date()).toISOString()));
  }

  debitAccount(receiverAccount: Account, money: Money) {
    if (!this.money.canBeDecreasedOf(money)) {
      throw new MethodNotAllowedException('Your credit is not enough to perform this operation');
    }

    if (!this.isAccountActive()) {
      throw new MethodNotAllowedException(`Account ${this.id.getValue()} has been deleted`);
    }

    if (!receiverAccount.isAccountActive()) {
      throw new MethodNotAllowedException(`Account ${receiverAccount.id.getValue()} has been deleted`);
    }

    this.apply(new AccountDebitedEvent(
      this.userId.getValue(),
      this.id.getValue(),
      receiverAccount.id.getValue(),
      Money.toDto(money),
      (new Date()).toISOString()));
  }

  creditAccount(senderAccountId: Id, money: Money) {
    // transaction fails with 20% probability
    const transactionFailed = Math.random() < 0.2;
    if (transactionFailed) {
      this.logger.error('Fund transfer failed. Transaction needs to be rollbacked');
      this.apply(new AccountCreditFailedEvent(
        this.userId.getValue(),
        senderAccountId.getValue(),
        this.id.getValue(),
        Money.toDto(money),
        (new Date()).toISOString()));
      return;
    }
      
    if (!this.isAccountActive()) {
        this.logger.error(`Account ${this.id.getValue()} has been deleted`);
        this.apply(new AccountCreditFailedEvent(
          this.userId.getValue(),
          senderAccountId.getValue(),
          this.id.getValue(),
          Money.toDto(money),
          (new Date()).toISOString()));
      return;
    }

    this.apply(new AccountCreditedEvent(
      this.userId.getValue(),
      this.id.getValue(),
      senderAccountId.getValue(),
      { amount: money.getAmount(), currency: money.getCurrency() },
      (new Date()).toISOString()));
  }

  onAccountCreatedEvent(event: AccountCreatedEvent): void {
    this.id = Id.fromString(event.accountId);
    this.money = Money.fromDto(event.balance);
    this.isDeleted = false;
    this.createdAt = event.creationDate;
    this.lastUpdatedAt = event.creationDate;
  }

  onAccountUpdatedEvent(event: AccountUpdatedEvent): void {
    if (event.currency) {
      this.money = Money.convertToCurrency(this.money, event.currency);
    }

    if (event.balance) {
      this.money = Money.fromDto(event.balance);
    }

    this.lastUpdatedAt = event.creationDate;
  }

  onAccountDeletedEvent(event: AccountDeletedEvent): void {
    this.isDeleted = true;
    this.lastUpdatedAt = event.creationDate;
  }

  onAccountDebitedEvent(event: AccountDebitedEvent): void {
    const savedMoney = Money.fromDto(event.money);
    this.money = this.money.decreaseAmount(savedMoney);
    this.lastUpdatedAt = event.creationDate;
  }

  onAccountCreditedEvent(event: AccountCreditedEvent): void {
    const savedMoney = Money.fromDto(event.money);
    this.money = this.money.increaseAmount(savedMoney);
    this.lastUpdatedAt = event.creationDate;
  }
}
