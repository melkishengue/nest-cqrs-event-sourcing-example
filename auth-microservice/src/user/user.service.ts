import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  findOne(email: string): User {
    return this.userRepository.findOneById(email);
  }

  createUser(createUserDto: CreateUserDto): User {
    return this.userRepository.save(createUserDto.email, createUserDto.password);
  }
}
