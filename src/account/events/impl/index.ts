import { AccountCreatedEvent } from "./account-created.event";
import { AccountCreditedEvent } from "./account-credited.event";
import { AccountDebitedEvent } from "./account-debited.event";

export type AccountEvent = AccountCreatedEvent | AccountDebitedEvent | AccountCreditedEvent;