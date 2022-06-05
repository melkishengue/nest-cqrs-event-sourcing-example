import { AccountCreatedHandler } from './account-created.handler';
import { AccountCreditedHandler } from './account-credited.handler';
import { AccountDebitedHandler } from './account-debited.handler';

export const EventHandlers = [AccountCreatedHandler, AccountDebitedHandler, AccountCreditedHandler];
