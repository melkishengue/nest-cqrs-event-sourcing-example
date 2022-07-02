import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountCommand } from './commands/impl/create-account.command';
import { DebitAccountCommand } from './commands/impl/debit-account.command';
import { DeleteAccountCommand } from './commands/impl/delete-account.command';
import { GetAccountQuery } from './queries/impl';
import { Currency, Money } from './value-objects/';

export interface DebitAccountDto {
  userId: string,
  accountId: string,
  amount: number,
  currency: Currency,
  receiverAccountId: string
}

export interface CreateAccountDto {
  userId: string,
  currency: Currency
}

export interface DeleteAccountDto {
  userId: string,
  accountId: string
}

export interface GetAccountDto {
  userId: string,
  accountId: string
}

@Controller('account')
export class AccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/')
  async getAccount(@Body() getAccountDto: GetAccountDto) {
    const { userId, accountId } = getAccountDto;
    return this.queryBus.execute(new GetAccountQuery(userId, accountId));
  }

  @Post('/create')
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.commandBus.execute(new CreateAccountCommand(createAccountDto.userId, createAccountDto.currency));
  }

  @Post('/debit')
  async debitAccount(@Body() debitAccountDto: DebitAccountDto) {
    const { userId, accountId, receiverAccountId, amount, currency } = debitAccountDto;
    return this.commandBus.execute(
      new DebitAccountCommand(
        userId, accountId, receiverAccountId, new Money(amount, currency)));
  }

  @Post('/delete')
  async deleteAccount(@Body() deleteAccountDto: DeleteAccountDto) {
    const { userId, accountId } = deleteAccountDto;
    return this.commandBus.execute(
      new DeleteAccountCommand(userId, accountId));
  }
}
