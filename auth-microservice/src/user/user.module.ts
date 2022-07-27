import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { filters } from './filters';

@Module({
  exports: [
    UserService,
  ],
  providers: [
    UserRepository,
    UserService,
    ...filters
  ],
})
export class UserModule {}
