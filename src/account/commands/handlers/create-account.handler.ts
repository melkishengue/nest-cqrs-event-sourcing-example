import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Account } from '../../models/account.model';
import { AccountRepository } from '../../repository/account.repository';
import { CreateAccountCommand } from '../impl/create-account.command';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand> {
  constructor(
    private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}

  protected readonly logger = new Logger(CreateAccountHandler.name);

  async execute(command: CreateAccountCommand) {
    const { userId, currency } = command;

    const replayedAccounts = this.repository.getAllAccounts(userId);
    const account = this.publisher.mergeObjectContext(
      new Account('', userId),
    );
    account.createAccount(replayedAccounts, currency);
    account.commit();
    
    return { message: 'Your request is being processed. You will receive an email in few minutes' };
  }
}
