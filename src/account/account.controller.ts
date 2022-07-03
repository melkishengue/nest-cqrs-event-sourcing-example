import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountCommand } from './commands/impl/create-account.command';
import { UpdateAccountCommand } from './commands/impl/update-account.command';
import { DebitAccountCommand } from './commands/impl/debit-account.command';
import { DeleteAccountCommand } from './commands/impl/delete-account.command';
import { GetAccountQuery, GetUserQuery } from './queries/impl';
import { Currency, Money } from './value-objects/';
import { HttpExceptionFilter } from './filters';

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

export type UpdateAccountDto = Partial<CreateAccountDto & {
  accountId: string
}>

export interface DeleteAccountDto {
  userId: string,
  accountId: string
}

export interface GetAccountDto {
  userId: string,
  accountId: string
}

export interface GetUserDto {
  userId: string,
}

@UseFilters(new HttpExceptionFilter())
@Controller('accounts')
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

  @Post('/update')
  async updateAccount(@Body() updateAccountDto: UpdateAccountDto) {
    const { accountId, userId, currency } = updateAccountDto;
    return this.commandBus.execute(new UpdateAccountCommand(accountId, userId, currency));
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

@UseFilters(new HttpExceptionFilter())
@Controller('users')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/:userId')
  async getUser(@Param('userId') userId: string) {
    return this.queryBus.execute(new GetUserQuery(userId));
  }
}