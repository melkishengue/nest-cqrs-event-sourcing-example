import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Account } from '../../models/account.model';
import { CreateAccountCommand } from '../impl/create-account.command';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand> {
  constructor(
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateAccountCommand) {
    const { userId } = command;
    const account = this.publisher.mergeObjectContext(
      new Account(''),
    );
    account.createAccount(userId);
    account.commit();
    
    return { message: 'Your request is being processed. You will receive an email in few minutes' };
  }
}
