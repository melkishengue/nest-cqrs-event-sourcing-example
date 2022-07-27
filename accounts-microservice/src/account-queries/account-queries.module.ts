import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreModule } from '../eventStore/eventStore.module';
import { AccountQueriesController } from './account-queries.controller';
import { projections } from './projections';
import { queryHandlers } from './queries/handlers';
import { repositories } from './repositories';

@Module({
  imports: [CqrsModule, EventStoreModule],
  controllers: [AccountQueriesController],
  providers: [
    ...projections,
    ...repositories,
    ...queryHandlers
  ],
})
export class AccountQueriesModule {}
