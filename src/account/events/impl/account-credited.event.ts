import { Money } from "../../value-objects/";

export class AccountCreditedEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly money: Money,
    public readonly creationDate: string,
  ) {}

  readonly type = 'AccountCreditedEvent';
}
