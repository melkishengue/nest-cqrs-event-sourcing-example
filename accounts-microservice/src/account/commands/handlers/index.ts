import { CreateAccountHandler } from './create-account.handler';
import { CreditAccountHandler } from './credit-account.handler';
import { DebitAccountHandler } from './debit-account.handler';
import { DeleteAccountHandler } from './delete-account.handler';
import { UpdateAccountHandler } from './update-account.handler';

export const CommandHandlers = [
  CreateAccountHandler,
  DebitAccountHandler,
  CreditAccountHandler,
  DeleteAccountHandler,
  UpdateAccountHandler
];
