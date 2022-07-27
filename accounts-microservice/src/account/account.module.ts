import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { AccountController } from './account.controller';
import { AccountRepository } from './repository/account.repository';
import { AccountSagas } from './sagas/account.sagas';
import { EventStoreModule } from '../eventStore/eventStore.module';
import { filters } from './filters';

@Module({
  imports: [CqrsModule, EventStoreModule],
  controllers: [AccountController],
  providers: [
    AccountRepository,
    ...CommandHandlers,
    ...EventHandlers,
    ...filters,
    AccountSagas,
  ],
})
export class AccountModule {}
