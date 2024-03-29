import { MoneyDto } from "../../dto";

export class AccountCreditFailedEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly receiverAccountId: string,
    public readonly money: MoneyDto,
    public readonly reason: string,
    public readonly creationDate: string,
  ) {}

  readonly type = 'AccountCreditFailedEvent';
}
