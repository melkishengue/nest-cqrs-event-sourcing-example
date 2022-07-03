import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AccountRepository } from '../../repository/account.repository';
import { GetUserQuery } from '../impl';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly repository: AccountRepository) {}

  async execute(query: GetUserQuery) {
    const { userId } = query;
    return {
      userId,
      accounts: this.repository.getAllAccounts(userId)
    };
  }
}
