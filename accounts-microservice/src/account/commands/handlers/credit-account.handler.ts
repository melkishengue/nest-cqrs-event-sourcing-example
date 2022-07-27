import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AccountRepository } from '../../repository/account.repository';
import { CreditAccountCommand } from '../impl/credit-account.command';

@CommandHandler(CreditAccountCommand)
export class CreditAccountHandler
  implements ICommandHandler<CreditAccountCommand> {
  constructor(
    private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}

  protected readonly logger = new Logger(CreditAccountHandler.name);

  async execute(command: CreditAccountCommand) {
    const { userId, accountId, money, senderId } = command;
    const replayedAccount = this.repository.findOneById(accountId, userId);
    if (!replayedAccount) {
      // TODO: should generate a compensating event
      this.logger.error(`Account ${accountId} does not exist`);
      return;
    }

    const account = this.publisher.mergeObjectContext(
      replayedAccount
    );
    account.creditAccount(senderId, money);
    account.commit();

    return account;
  }
}
