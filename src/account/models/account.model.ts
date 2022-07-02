import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer'
import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent } from '../events/impl';
import { AccountCreatedEvent } from '../events/impl/account-created.event';
import { AccountCreditFailedEvent } from '../events/impl/account-credit-failed.event';
import { AccountCreditedEvent } from '../events/impl/account-credited.event';
import { AccountDebitedEvent } from '../events/impl/account-debited.event';
import { AccountDeletedEvent } from '../events/impl/account-deleted.event';
import { Currency, Money } from '../value-objects/money.vo';

export class Account extends AggregateRoot {
  constructor(private readonly id: string, private readonly userId) {
    super();
  }

  protected readonly logger = new Logger(Account.name);
  private isDeleted: boolean = false;
  private INITIAL_SALDO = 1000;
  private money: Money;

  isAccountActive(): boolean {
    return !this.isDeleted;
  }

  createAccount(userAccounts: Account[], currency: Currency) {
    if (userAccounts && userAccounts.length > 1) {
      // Business rule: no user should have more than 2 accounts
      const message = `User ${this.userId} already has ${userAccounts.length} accounts!`;
      this.logger.error(message);
      return { message };
    }
    const accountId: string = (Math.random() + 1).toString(36).substring(7);
    this.apply(new AccountCreatedEvent(accountId, this.userId, currency));
  }

  deleteAccount() {
    if (this.isDeleted) {
      this.logger.error(`Account ${this.id} has been deleted`);
      return;
    }

    this.apply(new AccountDeletedEvent(this.userId, this.id));
  }

  debitAccount(receiverAccountId: string, money: Money) {
    if (!this.money.canBeDecreasedOf(money)) {
      this.logger.error('Your credit is not enough to perform this operation');
      return;
    }

    if (this.isDeleted) {
      this.logger.error(`Account ${this.id} has been deleted`);
      return;
    }

    this.apply(new AccountDebitedEvent(this.userId, this.id, receiverAccountId, money));
  }

  creditAccount(senderAccountId: string, money: Money) {
    // transaction fails with 20% probability
    const transactionFailed = Math.random() < 0.2;
    if (transactionFailed) {
      this.logger.error('Fund transfer failed. Transaction needs to be rollbacked');
      this.apply(new AccountCreditFailedEvent(this.userId, senderAccountId, this.id , money));
      return;
    }
    
    if (this.isDeleted) {
      this.logger.error(`Account ${this.id} has been deleted`);
      this.apply(new AccountCreditFailedEvent(this.userId, senderAccountId, this.id , money));
      return;
    }

    this.apply(new AccountCreditedEvent(this.userId, this.id, money));
  }

  applyEvents(events: DomainEvent[]): void {
    let savedMoney: Money;
    events.forEach(event => {
      const type = event.type;
      switch(type) {
        case 'AccountCreatedEvent':
          this.money = new Money(this.INITIAL_SALDO, event.currency);
          this.isDeleted = false;
          break;
        case 'AccountDeletedEvent':
          this.isDeleted = true;
          break;
        case 'AccountDebitedEvent':
          savedMoney = plainToInstance(Money, event.money);
          this.money.decreaseAmount(savedMoney);
          break;
        case 'AccountCreditedEvent':
          savedMoney = plainToInstance(Money, event.money);
          this.money.increaseAmount(savedMoney);
          break;
        default:
          this.logger.warn(`Unhandled event type: ${type}`);
      }
    });
  }
}
