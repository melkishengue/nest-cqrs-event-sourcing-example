// this example projection responds to the query of getting
// all accounts of a user

import { Injectable } from "@nestjs/common";
import { EventStore } from "../../eventStore/core/eventStore";
import { UserAccountRepository } from "../repositories/userAccounts.repository";

@Injectable()
export class UserAccountsProjection {
  eventIds: string[] = [];

  constructor(
    private readonly eventStore: EventStore,
    private readonly userAccountRepo: UserAccountRepository
  ) {
    this.eventStore.subscribeToStream('*', this);
  }

  handle(event) {
    if (this.eventIds.includes(event.version)) {
      // abort if event has been already been processed
      return;
    }

    const eventType = event?.event?.type;
    if (!['AccountCreatedEvent', 'AccountDeletedEvent'].includes(eventType)) {
      return;
    }

    const { accountId, balance, creationDate, userId } = event.event;
    switch(eventType) {
      case 'AccountCreatedEvent':
        this.userAccountRepo.save(userId, {
          accountId,
          balance,
          creationDate
        });
        this.eventIds.push(event.version);
      case 'AccountDeletedEvent':
        this.userAccountRepo.delete(userId, accountId);
        this.eventIds.push(event.version);
      default:
        // unknown event
    }
  }
}