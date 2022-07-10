import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserAccountsQuery } from './queries/impl';

@Controller('/queries/users/')
export class AccountQueriesController {
  constructor(
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/:userId')
  async getAccounts(@Param('userId') userId: string) {
    // return this.userAccountsRepo.getAccounts(userId);
    return this.queryBus.execute(new GetUserAccountsQuery(userId));
  }
}
