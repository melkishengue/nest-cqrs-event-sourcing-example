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
    const { userId, accountId, currency } = command;
    const replayedAccount = this.repository.findOneById(accountId, userId);
    if (!replayedAccount) {
      this.logger.error(`Account ${accountId} does not exist`);
      return { message: 'Account not found.' };
    }

    const account = this.publisher.mergeObjectContext(
      replayedAccount
    );
    account.updateAccount(accountId, userId, currency);
    account.commit();
    
    return { message: 'Your request is being processed. You will receive an email in few minutes' };
  }
}
