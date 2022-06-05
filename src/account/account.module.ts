import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { AccountController } from './account.controller';
import { AccountRepository } from './repository/account.repository';
import { AccountSagas } from './sagas/account.sagas';
import { EventStoreModule } from '../eventStore/eventStore.module';

@Module({
  imports: [CqrsModule, EventStoreModule],
  controllers: [AccountController],
  providers: [
    AccountRepository,
    ...CommandHandlers,
    ...EventHandlers,
    AccountSagas,
  ],
})
export class AccountModule {}
