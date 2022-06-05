import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateAccountCommand } from './commands/impl/create-account.command';
import { DebitAccountCommand } from './commands/impl/debit-account.command';
import { AccountRepository } from './repository/account.repository';

export interface DebitAccountDto {
  accountId: string, amount: number, receiverId: string
}

@Controller('account')
export class AccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly repository: AccountRepository,
  ) {}

  @Get('/:id')
  async getAccount(@Param('id') accountId: string) {
    return this.repository.findOneById(accountId);
  }

  @Post('/create')
  async createAccount(@Param('userId') userId: string) {
    return this.commandBus.execute(new CreateAccountCommand(userId));
  }

  @Post('/debit')
  async debitAccount(@Body() debitAccountDto: DebitAccountDto) {
    return this.commandBus.execute(
      new DebitAccountCommand(debitAccountDto.accountId, debitAccountDto.receiverId, debitAccountDto.amount));
  }
}
