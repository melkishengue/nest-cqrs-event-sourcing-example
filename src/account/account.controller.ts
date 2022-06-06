import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountCommand } from './commands/impl/create-account.command';
import { DebitAccountCommand } from './commands/impl/debit-account.command';
import { DeleteAccountCommand } from './commands/impl/delete-account.command';
import { GetAccountQuery } from './queries/impl';

export interface DebitAccountDto {
  accountId: string, amount: number, receiverAccountId: string
}

export interface DeleteAccountDto {
  accountId: string
}

@Controller('account')
export class AccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/:id')
  async getAccount(@Param('id') accountId: string) {
    return this.queryBus.execute(new GetAccountQuery(accountId));
  }

  @Post('/create')
  async createAccount(@Param('userId') userId: string) {
    return this.commandBus.execute(new CreateAccountCommand(userId));
  }

  @Post('/debit')
  async debitAccount(@Body() debitAccountDto: DebitAccountDto) {
    return this.commandBus.execute(
      new DebitAccountCommand(debitAccountDto.accountId, debitAccountDto.receiverAccountId, debitAccountDto.amount));
  }

  @Post('/delete')
  async deleteAccount(@Body() deleteAccountDto: DeleteAccountDto) {
    return this.commandBus.execute(
      new DeleteAccountCommand(deleteAccountDto.accountId));
  }
}
