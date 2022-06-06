import { AccountCreatedEvent } from "./account-created.event";
import { AccountCreditedEvent } from "./account-credited.event";
import { AccountDebitedEvent } from "./account-debited.event";
import { AccountDeletedEvent } from "./account-deleted.event";

export type DomainEvent = AccountCreatedEvent
  | AccountDebitedEvent
  | AccountCreditedEvent
  | AccountDeletedEvent;