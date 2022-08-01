import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccountQueriesModule } from './account-queries/account-queries.module';
import { AccountModule } from './account/account.module';
import { JwtAuthGuard } from './auth/guards/';
import { JwtStrategy } from './auth/strategies';
import { EventStoreModule } from './eventStore/eventStore.module';
import { jwtConstants } from './auth/constants';
import { AppController } from './app.controller';
@Module({
  imports: [
    AccountModule,
    EventStoreModule,
    AccountQueriesModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6000s' },
    }),
  ],
  providers: [
    JwtAuthGuard,
    JwtStrategy
  ],
  controllers: [
    AppController
  ]
})
export class AppModule {}
