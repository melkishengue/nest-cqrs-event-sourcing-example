import { Module } from '@nestjs/common';
import { AccountQueriesModule } from './account-queries/account-queries.module';
import { AccountModule } from './account/account.module';
import { EventStoreModule } from './eventStore/eventStore.module';

@Module({
  imports: [
    AccountModule,
    EventStoreModule,
    AccountQueriesModule
  ],
})
export class ApplicationModule {}
