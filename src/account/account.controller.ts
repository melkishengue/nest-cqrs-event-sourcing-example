import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateAccountCommand } from './commands/impl/create-account.command';
import { UpdateAccountCommand } from './commands/impl/update-account.command';
import { DebitAccountCommand } from './commands/impl/debit-account.command';
import { DeleteAccountCommand } from './commands/impl/delete-account.command';
import { Id, Money } from './value-objects/';
import { HttpExceptionFilter } from './filters';
import {
  CreateAccountDto,
  DebitAccountDto,
  DeleteAccountDto,
  UpdateAccountDto
} from './dto';

@UseFilters(new HttpExceptionFilter())
@Controller('accounts')
export class AccountController {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Post('/')
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    const { userId, balance } = createAccountDto;
    return this.commandBus.execute(new CreateAccountCommand(
      Id.fromString(userId),
      Money.fromDto(balance)
    ));
  }

  @Patch('/:id')
  async updateAccount(@Param('id') accountId: string, @Body() updateAccountDto: UpdateAccountDto) {
    const { userId, currency, balance } = updateAccountDto;
    return this.commandBus.execute(new UpdateAccountCommand(
      Id.fromString(accountId),
      Id.fromString(userId),
      currency,
      balance ? Money.fromDto(balance) : undefined));
  }

  @Post('/:id/debit')
  async debitAccount(@Param('id') accountId: string, @Body() debitAccountDto: DebitAccountDto) {
    const { userId, receiverAccountId, money, receiverUserId } = debitAccountDto;
    return this.commandBus.execute(
      new DebitAccountCommand(
        Id.fromString(userId),
        Id.fromString(accountId),
        Id.fromString(receiverAccountId),
        Id.fromString(receiverUserId),
        Money.fromDto(money)));
  }

  @Delete('/:id')
  async deleteAccount(@Param('id') accountId: string, @Body() deleteAccountDto: DeleteAccountDto) {
    const { userId } = deleteAccountDto;
    return this.commandBus.execute(
      new DeleteAccountCommand(
        Id.fromString(userId),
        Id.fromString(accountId)));
  }
}
