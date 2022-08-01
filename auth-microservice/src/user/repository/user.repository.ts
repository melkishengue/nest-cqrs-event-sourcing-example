import { Injectable, Logger, OnModuleInit, BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { ClientUser, User } from '../entities/user.entity';

@Injectable()
export class UserRepository implements OnModuleInit {
  protected readonly logger = new Logger(UserRepository.name);
  protected readonly DB_PATH = resolve('users.json');
  private users: User[] = [];

  onModuleInit() {
    this.users = this.loadDataFromFile();

    // persist users to database every 3 seconds
    setInterval(() => this.flushIntoDatabaseFile(), 3000);
  }

  findOneById(email: string): User | null {
    return this.users.find(user => user.email === email);
  }

  save(email: string, password: string): ClientUser | null {
    const foundUser = this.users.find(user => user.email === email);

    if (foundUser) {
      throw new BadRequestException(`User with email ${email} already exists`);
    }

    const user = new User(
      uuid(),
      email,
      password,
      new Date().toISOString()
    );

    this.users.push(user);
    const { password: p, ...allButPassword } = user;
    return allButPassword;
  }

  loadDataFromFile(): User[] {
    try {
      this.logger.log(`Loading ${this.DB_PATH}`);
      const data = readFileSync(this.DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      this.logger.error(`Faild to load data file ${this.DB_PATH}.`);
      return [];
    }
  }

  flushIntoDatabaseFile() {
    // 🖕 event-loop
    writeFileSync(this.DB_PATH, JSON.stringify(this.users, null, 4));
  }
}
