import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AccountRepository } from '../../repository/account.repository';
import { DebitAccountCommand } from '../impl/debit-account.command';

@CommandHandler(DebitAccountCommand)
export class DebitAccountHandler
  implements ICommandHandler<DebitAccountCommand> {
  constructor(
    private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}
  protected readonly logger = new Logger(DebitAccountHandler.name);

  async execute(command: DebitAccountCommand) {
    const { userId, accountId, money, receiverAccountId } = command;
    const replayedAccount = this.repository.findOneById(accountId, userId);

    if (!replayedAccount) {
      this.logger.error(`Account ${accountId} does not exist`);
      throw new Error('Non existing account');
    }

    const account = this.publisher.mergeObjectContext(
      replayedAccount
    );
    account.debitAccount(receiverAccountId, money);
    account.commit();

    return { message: 'Your request is being processed. You will receive an email in few minutes' };
  }
}
