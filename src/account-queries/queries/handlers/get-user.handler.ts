import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserAccountRepository } from '../../repositories/userAccounts.repository';
import { GetUserAccountsQuery } from '../impl';

@QueryHandler(GetUserAccountsQuery)
export class GetUserAccountsHandler implements IQueryHandler<GetUserAccountsQuery> {
  constructor(private readonly repository: UserAccountRepository) {}

  async execute(query: GetUserAccountsQuery) {
    const { userId } = query;
    return {
      userId,
      accounts: this.repository.getAccounts(userId)
    };
  }
}
