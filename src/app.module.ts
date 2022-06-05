import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { EventStoreModule } from './eventStore/eventStore.module';

@Module({
  imports: [AccountModule, EventStoreModule],
})
export class ApplicationModule {}
