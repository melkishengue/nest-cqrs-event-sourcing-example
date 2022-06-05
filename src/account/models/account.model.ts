import { AggregateRoot } from '@nestjs/cqrs';
import { AccountEvent } from '../events/impl';
import { AccountCreatedEvent } from '../events/impl/account-created.event';
import { AccountCreditedEvent } from '../events/impl/account-credited.event';
import { AccountDebitedEvent } from '../events/impl/account-debited.event';

const INITIAL_SALDO = 1000;

export class Account extends AggregateRoot {
  constructor(private readonly id: string) {
    super();
  }

  private amount: number = 0;

  createAccount(userId: string) {
    // TODO: implement domain logic, user should not have more than 2 accounts
    const accountId: string = (Math.random() + 1).toString(36).substring(7);
    this.apply(new AccountCreatedEvent(accountId, userId));
  }

  debitAccount(receiverId: string, amount: number) {
    if (this.amount < amount) {
      console.error('Your credit is not enough to perform this operation');
      return;
    }

    this.apply(new AccountDebitedEvent(this.id, receiverId, amount));
  }

  creditAccount(amount: number) {
    this.apply(new AccountCreditedEvent(this.id, amount));
  }

  applyEvent(event: AccountEvent): void {
    switch(event.type) {
      case 'AccountCreatedEvent':
        this.amount = INITIAL_SALDO;
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
        console.log('The default case');
    }
  }
}
