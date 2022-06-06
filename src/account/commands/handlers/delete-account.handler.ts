import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AccountRepository } from '../../repository/account.repository';
import { DeleteAccountCommand } from '../impl/delete-account.command';

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountHandler
  implements ICommandHandler<DeleteAccountCommand> {
  constructor(
    private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}
  protected readonly logger = new Logger(DeleteAccountHandler.name);

  async execute(command: DeleteAccountCommand) {
    const { accountId, userId } = command;
    const replayedAccount = this.repository.findOneById(accountId, userId);

    if (!replayedAccount) {
      this.logger.error(`Account ${accountId} does not exist`);
      throw new Error('Non existing account');
    }

    const account = this.publisher.mergeObjectContext(
      replayedAccount
    );
    account.deleteAccount();
    account.commit();

    return { message: 'Your request is being processed. You will receive an email in few minutes' };
  }
}
