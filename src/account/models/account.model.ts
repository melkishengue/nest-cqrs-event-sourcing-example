import { v4 as uuid } from 'uuid';
import { BadRequestException, ForbiddenException, Logger, MethodNotAllowedException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer'
import { AggregateRoot } from '@nestjs/cqrs';
import { AccountCreatedEvent, AccountCreditedEvent, AccountCreditFailedEvent, AccountDebitedEvent, DomainEvent } from '../events/impl';
import { Currency, Money } from '../value-objects/';
import { AccountUpdatedEvent, AccountDeletedEvent } from '../events/impl/';

export class Account extends AggregateRoot {
  constructor(private readonly id: string, private readonly userId) {
    super();
  }

  protected readonly logger = new Logger(Account.name);
  private isDeleted: boolean = false;
  private INITIAL_SALDO = 1000;
  private money: Money;
  private lastUpdatedAt: string;
  private createdAt: string;

  isAccountActive(): boolean {
    return !this.isDeleted;
  }

  createAccount(userAccounts: Account[], currency: Currency) {
    if (userAccounts && userAccounts.length >= 2) {
      // Business rule: no user should have more than 4 accounts
      const message = `User ${this.userId} already has ${userAccounts.length} accounts!`;
      throw new ForbiddenException(message);
    }

    const accountId = uuid();
    this.apply(new AccountCreatedEvent(accountId, this.userId, currency, (new Date()).toISOString()));
  }

  updateAccount(accountId: string, userId: string, currency?: Currency) {
    if (!(currency && Object.values(Currency).includes(currency))) {
      throw new BadRequestException(`Unknown currency ${currency}`);
    }

    this.apply(new AccountUpdatedEvent(this.userId, this.id, currency, (new Date()).toISOString()));
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

    this.apply(new AccountDebitedEvent(this.userId, this.id, receiverAccountId, money, (new Date()).toISOString()));
  }

  creditAccount(senderAccountId: string, money: Money) {
    // transaction fails with 20% probability
    const transactionFailed = Math.random() < 0.2;
    if (transactionFailed) {
      this.logger.error('Fund transfer failed. Transaction needs to be rollbacked');
      this.apply(new AccountCreditFailedEvent(this.userId, senderAccountId, this.id , money, (new Date()).toISOString()));
      return;
    }
    
    if (this.isDeleted) {
      this.logger.error(`Account ${this.id} has been deleted`);
      this.apply(new AccountCreditFailedEvent(this.userId, senderAccountId, this.id , money, (new Date()).toISOString()));
      return;
    }

    this.apply(new AccountCreditedEvent(this.userId, this.id, money, (new Date()).toISOString()));
  }

  applyEvents(events: DomainEvent[]): void {
    let savedMoney: Money;
    events.forEach(event => {
      const type = event.type;
      switch(type) {
        case 'AccountCreatedEvent':
          this.money = new Money(this.INITIAL_SALDO, event.currency);
          this.isDeleted = false;
          this.createdAt = event.creationDate;
          break;
        case 'AccountUpdatedEvent':
          this.money = Money.convertToCurrency(this.money, event.currency);
          break;
        case 'AccountDeletedEvent':
          this.isDeleted = true;
          break;
        case 'AccountDebitedEvent':
          savedMoney = plainToInstance(Money, event.money);
          this.money = this.money.decreaseAmount(savedMoney);
          break;
        case 'AccountCreditedEvent':
          savedMoney = plainToInstance(Money, event.money);
          this.money = this.money.increaseAmount(savedMoney);
          break;
        default:
          this.logger.warn(`Unhandled event type: ${type}`);
      }

      this.lastUpdatedAt = event.creationDate;
    });
  }
}
