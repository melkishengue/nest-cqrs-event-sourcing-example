import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { CreditAccountCommand } from '../commands/impl/credit-account.command';
import { AccountCreditFailedEvent } from '../events/impl/account-credit-failed.event';
import { AccountDebitedEvent } from '../events/impl/account-debited.event';

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
          return new CreditAccountCommand(event.userId, event.receiverAccountId, event.accountId, event.amount);
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
        return new CreditAccountCommand(event.userId, event.accountId, event.receiverAccountId, event.amount);
      }),
    );
  }
}
