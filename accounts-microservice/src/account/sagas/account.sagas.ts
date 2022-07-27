import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { CreditAccountCommand } from '../commands/impl/credit-account.command';
import { AccountCreditFailedEvent } from '../events/impl/account-credit-failed.event';
import { AccountDebitedEvent } from '../events/impl/account-debited.event';
import { Id, Money } from '../value-objects';

@Injectable()
export class AccountSagas {
  protected readonly logger = new Logger(AccountSagas.name);

  @Saga()
  accountDebited = (events$: Observable<any>): Observable<ICommand> => {
    return events$
      .pipe(
        ofType(AccountDebitedEvent),
        delay(1000),
        map(event => {
          this.logger.warn('Crediting receiving account');
          return new CreditAccountCommand(
            Id.fromString(event.userId),
            Id.fromString(event.receiverAccountId),
            Id.fromString(event.accountId),
            Money.fromDto(event.money))
        }),
      );
  }

  @Saga()
  receiverAccountCreditedFailed = (events$: Observable<any>): Observable<ICommand> => {
    return events$
    .pipe(
      ofType(AccountCreditFailedEvent),
      delay(1000),
      map(event => {
        this.logger.warn('Compensating sender account after failed transaction');
        return new CreditAccountCommand(
          Id.fromString(event.userId),
          Id.fromString(event.accountId),
          Id.fromString(event.receiverAccountId),
          Money.fromDto(event.money));
      }),
    );
  }
}
