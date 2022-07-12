import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserAccountRepository } from '../../repositories/userAccounts.repository';
import { GetUserAccountQuery } from '../impl';

@QueryHandler(GetUserAccountQuery)
export class GetUserAccountHandler implements IQueryHandler<GetUserAccountQuery> {
  constructor(private readonly repository: UserAccountRepository) {}

  async execute(query: GetUserAccountQuery) {
    const { userId, accountId } = query;
    return this.repository.getAccount(userId, accountId)
  }
}
