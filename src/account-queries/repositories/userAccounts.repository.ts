import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { writeFileSync } from "fs";
import { resolve } from "path";

export interface Balance {
  currency: string,
  amount: number,
}

export interface OperationLog {
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'BALANCE_UPDATE',
  amount: Balance,
  newBalance: Balance,
  date: string,
  receiverId?: string,
  senderId?: string
}

export interface UserAccount {
  accountId: string,
  balance: Balance,
  operations: OperationLog[],
  creationDate: string,
  isDeleted: boolean,
}

@Injectable()
export class UserAccountRepository implements OnModuleInit {
  protected readonly logger = new Logger(UserAccountRepository.name);
  protected readonly DB_PATH = resolve('userAccounts.json');
  private userAccounts: Record<string, UserAccount[]> = {};

  onModuleInit() {
    // persist events to database every 3 seconds
    setInterval(() => this.flushIntoDatabaseFile(), 3000);
  }

  // performs an upsert
  save(userId: string, userAccount: UserAccount) {
    if (!this.userAccounts[userId]) {
      this.userAccounts[userId] = [];
    }

    const accountExists = this.userAccounts[userId]
      .find(account => account.accountId === userAccount.accountId);

    if (accountExists) {
      this.userAccounts[userId] = this.userAccounts[userId].map(account => {
        return account.accountId === userAccount.accountId ? userAccount : account
      });

      return;
    }

    this.userAccounts[userId].push(userAccount);
  }

  findOneById(userId: string, accountId: string): UserAccount {
    return this.userAccounts[userId]
      .find(account => ((account.accountId === accountId) && !account.isDeleted));
  }

  delete(userId: string, accountId: string) {
    const accounts = this.userAccounts[userId];

    if (!accounts || accounts.length === 0) {
      return;
    }

    this.userAccounts[userId] = accounts
      .map(account => {
        if (account.accountId === accountId) {
          return {
            ...account,
            isDeleted: true,
          }
        }

        return account;
      });
  }

  getAccounts(userId: string): UserAccount[] {
    return this.userAccounts[userId].filter(account => !account.isDeleted);
  }

  getAccount(userId: string, accountId): UserAccount {
    return this.userAccounts[userId]
      .find(account => ((account.accountId === accountId) && !account.isDeleted));
  }

  flushIntoDatabaseFile() {
    // 🖕 event-loop
    writeFileSync(this.DB_PATH, JSON.stringify(this.userAccounts, null, 4));
  }
}
