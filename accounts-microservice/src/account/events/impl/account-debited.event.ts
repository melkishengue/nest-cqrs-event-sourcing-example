import { MoneyDto } from "../../dto";

export class AccountDebitedEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly receiverAccountId: string,
    public readonly money: MoneyDto,
    public readonly creationDate: string,
  ) {}

  readonly type = 'AccountDebitedEvent';
}
