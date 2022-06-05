import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import * as clc from 'cli-color';
import { AccountRepository } from '../../repository/account.repository';
import { DebitAccountCommand } from '../impl/debit-account.command';

@CommandHandler(DebitAccountCommand)
export class DebitAccountHandler
  implements ICommandHandler<DebitAccountCommand> {
  constructor(
    private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DebitAccountCommand) {
    console.log(clc.yellowBright('Async DebitAccountCommand...'));

    const { accountId, amount, receiverId } = command;
    const replayedAccount = this.repository.findOneById(accountId);

    if (!replayedAccount) {
      throw new Error('Non existing account');
    }

    const account = this.publisher.mergeObjectContext(
      replayedAccount
    );
    account.debitAccount(receiverId, amount);
    account.commit();
  }
}
