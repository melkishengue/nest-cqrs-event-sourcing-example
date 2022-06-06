import { Logger } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent } from '../events/impl';
import { AccountCreatedEvent } from '../events/impl/account-created.event';
import { AccountCreditFailedEvent } from '../events/impl/account-credit-failed.event';
import { AccountCreditedEvent } from '../events/impl/account-credited.event';
import { AccountDebitedEvent } from '../events/impl/account-debited.event';
import { AccountDeletedEvent } from '../events/impl/account-deleted.event';

const INITIAL_SALDO = 1000;

export class Account extends AggregateRoot {
  constructor(private readonly id: string) {
    super();
  }

  protected readonly logger = new Logger(Account.name);
  private amount: number = 0;
  private isDeleted: boolean = false;

  createAccount(userId: string) {
    // TODO: implement domain logic, user should not have more than 2 accounts
    const accountId: string = (Math.random() + 1).toString(36).substring(7);
    this.apply(new AccountCreatedEvent(accountId, userId));
  }

  deleteAccount() {
    if (this.isDeleted) {
      this.logger.error(`Account ${this.id} has been deleted`);
      return;
    }

    this.apply(new AccountDeletedEvent(this.id));
  }

  debitAccount(receiverAccountId: string, amount: number) {
    if (this.amount < amount) {
      this.logger.error('Your credit is not enough to perform this operation');
      return;
    }

    if (this.isDeleted) {
      this.logger.error(`Account ${this.id} has been deleted`);
      return;
    }

    this.apply(new AccountDebitedEvent(this.id, receiverAccountId, amount));
  }

  creditAccount(senderId: string, amount: number) {
    // transaction fails with 20% probability
    const transactionFailed = Math.random() < 0.2;
    if (transactionFailed) {
      this.logger.error('Fund transfer failed. Transaction needs to be rollbacked');
      this.apply(new AccountCreditFailedEvent(senderId, this.id , amount));
      return;
    }
    
    if (this.isDeleted) {
      this.logger.error(`Account ${this.id} has been deleted`);
      this.apply(new AccountCreditFailedEvent(senderId, this.id , amount));
      return;
    }

    this.apply(new AccountCreditedEvent(this.id, amount));
  }

  applyEvent(event: DomainEvent): void {
    switch(event.type) {
      case 'AccountCreatedEvent':
        this.amount = INITIAL_SALDO;
        this.isDeleted = false;
        break;
      case 'AccountDeletedEvent':
        this.isDeleted = true;
        break;
      case 'AccountDebitedEvent':
        // TODO: type narrowing needed to detect amount property
        // @ts-ignore
        this.amount -= event.amount;
        break;
      case 'AccountCreditedEvent':
        // TODO: type narrowing needed to detect amount property
        // @ts-ignore
        this.amount += event.amount;
        break;
      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
    }
  }
}
