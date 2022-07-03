import { Money } from "../../value-objects/";

export class AccountDebitedEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly receiverAccountId: string,
    public readonly money: Money,
    public readonly creationDate: string,
  ) {}

  readonly type = 'AccountDebitedEvent';
}
