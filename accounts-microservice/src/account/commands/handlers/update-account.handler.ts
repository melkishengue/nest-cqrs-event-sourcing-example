import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AccountRepository } from '../../repository/account.repository';
import { UpdateAccountCommand } from '../impl/update-account.command';

@CommandHandler(UpdateAccountCommand)
export class UpdateAccountHandler
  implements ICommandHandler<UpdateAccountCommand> {
  constructor(
    private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}

  protected readonly logger = new Logger(UpdateAccountHandler.name);

  async execute(command: UpdateAccountCommand) {
    const { userId, accountId, currency, balance } = command;
    const replayedAccount = this.repository.findOneById(accountId, userId);
    if (!replayedAccount) {
      const message = `Account ${accountId} does not exist`;
      this.logger.error(message);
      return { message };
    }

    const account = this.publisher.mergeObjectContext(
      replayedAccount
    );
    account.updateAccount(accountId, userId, currency, balance);
    account.commit();
    
    return account;
  }
}
