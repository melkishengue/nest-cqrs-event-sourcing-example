import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import * as clc from 'cli-color';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { CreditAccountCommand } from '../commands/impl/credit-account.command';
import { AccountDebitedEvent } from '../events/impl/account-debited.event';

@Injectable()
export class AccountSagas {
  @Saga()
  dragonKilled = (events$: Observable<any>): Observable<ICommand> => {
    return events$
      .pipe(
        ofType(AccountDebitedEvent),
        delay(1000),
        map(event => {
          console.log(clc.redBright('Inside [AccountSagas] Saga'));
          return new CreditAccountCommand(event.receiverId, event.amount);
        }),
      );
  }
}
