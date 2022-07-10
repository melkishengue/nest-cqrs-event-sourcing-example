import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

export interface UserAccount {
  accountId: string, balance: { currency: string, amount: number }, creationDate: string
}

@Injectable()
export class UserAccountRepository implements OnModuleInit {
  protected readonly logger = new Logger(UserAccountRepository.name);
  protected readonly DB_PATH = resolve('userAccounts.json');
  private userAccounts: Record<string, UserAccount[]> = {};

  onModuleInit() {
    try {
      const eventsData = readFileSync(this.DB_PATH, 'utf-8');
      this.userAccounts = JSON.parse(eventsData);
    } catch (error) {
      this.logger.warn(`File ${this.DB_PATH} was not found. It will be created at the first insert`);
    }

    // persist events to database every 3 seconds
    setInterval(() => this.flushIntoDatabase(), 3000);
  }

  save(userId: string, userAccount: UserAccount): void {
    if (!this.userAccounts[userId]) {
      this.userAccounts[userId] = [];
    }

    this.userAccounts[userId].push(userAccount);
  }

  delete(userId: string, accountId: string): void {
    const accounts = this.userAccounts[userId];

    if (!accounts || accounts.length === 0) {
      return;
    }

    this.userAccounts[userId] = accounts.filter(account => account.accountId !== accountId);
  }

  getAccounts(userId: string):  UserAccount[] {
    return this.userAccounts[userId]
  }

  flushIntoDatabase(): void {
    // 🖕 event-loop
    writeFileSync(this.DB_PATH, JSON.stringify(this.userAccounts, null, 4));
  }
}