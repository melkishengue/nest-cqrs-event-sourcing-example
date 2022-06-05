import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import * as clc from 'cli-color';
import { AccountRepository } from '../../repository/account.repository';
import { CreditAccountCommand } from '../impl/credit-account.command';

@CommandHandler(CreditAccountCommand)
export class CreditAccountHandler
  implements ICommandHandler<CreditAccountCommand> {
  constructor(
    private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreditAccountCommand) {
    console.log(clc.yellowBright('Async CreditAccountCommand...'));

    const { accountId, amount } = command;
    const replayedAccount = this.repository.findOneById(accountId);
    if (!replayedAccount) {
      throw new Error('Non existing account');
    }

    const account = this.publisher.mergeObjectContext(
      replayedAccount
    );
    account.creditAccount(amount);
    account.commit();
  }
}
