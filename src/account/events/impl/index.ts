import { AccountCreatedEvent } from "./account-created.event";
import { AccountCreditFailedEvent } from "./account-credit-failed.event";
import { AccountCreditedEvent } from "./account-credited.event";
import { AccountDebitedEvent } from "./account-debited.event";
import { AccountDeletedEvent } from "./account-deleted.event";
import { AccountUpdatedEvent } from "./account-updated.event";

export type DomainEvent = AccountCreatedEvent
  | AccountDebitedEvent
  | AccountCreditedEvent
  | AccountUpdatedEvent
  | AccountCreditFailedEvent
  | AccountDeletedEvent;

export * from "./account-created.event";
export * from "./account-credited.event";
export * from "./account-debited.event";
export * from "./account-deleted.event";
export * from "./account-updated.event";
export * from "./account-credit-failed.event";