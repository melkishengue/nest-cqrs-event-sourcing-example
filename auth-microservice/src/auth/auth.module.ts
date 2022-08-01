import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { filters } from './filters';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6000s' },
    }),
  ],
  exports: [
    AuthService,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    ...filters,
  ],
})
export class AuthModule {}
