import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { AccountController, UserController } from './account.controller';
import { AccountRepository } from './repository/account.repository';
import { AccountSagas } from './sagas/account.sagas';
import { EventStoreModule } from '../eventStore/eventStore.module';
import { QueryHandlers } from './queries/handlers';
import { filters } from './filters';

@Module({
  imports: [CqrsModule, EventStoreModule],
  controllers: [AccountController, UserController],
  providers: [
    AccountRepository,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    AccountSagas,
    ...filters
  ],
})
export class AccountModule {}
