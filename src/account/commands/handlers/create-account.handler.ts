import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import * as clc from 'cli-color';
import { Account } from '../../models/account.model';
// import { AccountRepository } from '../../repository/account.repository';
import { CreateAccountCommand } from '../impl/create-account.command';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand> {
  constructor(
    // private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateAccountCommand) {
    console.log(clc.yellowBright('Async CreateAccountCommand...'));

    const { userId } = command;
    const account = this.publisher.mergeObjectContext(
      new Account(''),
    );
    account.createAccount(userId);
    account.commit();
  }
}
