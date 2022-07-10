import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountCommand } from './commands/impl/create-account.command';
import { UpdateAccountCommand } from './commands/impl/update-account.command';
import { DebitAccountCommand } from './commands/impl/debit-account.command';
import { DeleteAccountCommand } from './commands/impl/delete-account.command';
import { GetAccountQuery, GetUserQuery } from './queries/impl';
import { Money } from './value-objects/';
import { HttpExceptionFilter } from './filters';
import {
  CreateAccountDto,
  DebitAccountDto,
  DeleteAccountDto,
  GetAccountDto,
  UpdateAccountDto
} from './dto';

@UseFilters(new HttpExceptionFilter())
@Controller('accounts')
export class AccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // TODO: will be moved to the query side 
  @Get('/:id')
  async getAccount(@Param('id') accountId: string, @Body() getAccountDto: GetAccountDto) {
    const { userId } = getAccountDto;
    return this.queryBus.execute(new GetAccountQuery(userId, accountId));
  }

  @Post('/')
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    const { userId, balance } = createAccountDto;
    return this.commandBus.execute(new CreateAccountCommand(
      userId,
      new Money(balance.amount, balance.currency)
    ));
  }

  @Patch('/:id')
  async updateAccount(@Param('id') accountId: string, @Body() updateAccountDto: UpdateAccountDto) {
    const { userId, currency, balance } = updateAccountDto;
    return this.commandBus.execute(new UpdateAccountCommand(
      accountId,
      userId,
      currency,
      balance ? new Money(balance.amount, balance.currency) : undefined));
  }

  @Post('/:id/debit')
  async debitAccount(@Param('id') accountId: string, @Body() debitAccountDto: DebitAccountDto) {
    const { userId, receiverAccountId, money } = debitAccountDto;
    return this.commandBus.execute(
      new DebitAccountCommand(
        userId, accountId, receiverAccountId, new Money(money.amount, money.currency)));
  }

  @Delete('/:id')
  async deleteAccount(@Param('id') accountId: string, @Body() deleteAccountDto: DeleteAccountDto) {
    const { userId } = deleteAccountDto;
    return this.commandBus.execute(
      new DeleteAccountCommand(userId, accountId));
  }
}

// should normally belong to a seperate module
@UseFilters(new HttpExceptionFilter())
@Controller('users')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
  ) {}

  // will be moved to the query side
  @Get('/:userId')
  async getUser(@Param('userId') userId: string) {
    return this.queryBus.execute(new GetUserQuery(userId));
  }
}
