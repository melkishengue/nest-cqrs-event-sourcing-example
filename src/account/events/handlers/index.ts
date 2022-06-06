import { AccountCreatedHandler } from './account-created.handler';
import { AccountCreditedHandler } from './account-credited.handler';
import { AccountDebitedHandler } from './account-debited.handler';
import { AccountDeletedHandler } from './account-deleted.handler';

export const EventHandlers = [
  AccountCreatedHandler,
  AccountDebitedHandler,
  AccountCreditedHandler,
  AccountDeletedHandler
];
