import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreModule } from '../eventStore/eventStore.module';
import { AccountQueriesController } from './account-queries.controller';
import { projections } from './projections';
import { QueryHandlers } from './queries/handlers';
import { repositories } from './repositories';

@Module({
  imports: [CqrsModule, EventStoreModule],
  controllers: [AccountQueriesController],
  providers: [
    ...projections,
    ...repositories,
    ...QueryHandlers
  ],
})
export class AccountQueriesModule {}
