import { MoneyDto } from "../../dto";

export class AccountCreditedEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly money: MoneyDto,
    public readonly creationDate: string,
  ) {}

  readonly type = 'AccountCreditedEvent';
}
