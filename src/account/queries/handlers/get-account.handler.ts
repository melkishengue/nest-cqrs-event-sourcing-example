import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AccountRepository } from '../../repository/account.repository';
import { GetAccountQuery } from '../impl';

@QueryHandler(GetAccountQuery)
export class GetAccountHandler implements IQueryHandler<GetAccountQuery> {
  constructor(private readonly repository: AccountRepository) {}

  async execute(query: GetAccountQuery) {
    const { accountId, userId } = query;
    return this.repository.findOneById(accountId, userId);
  }
}
