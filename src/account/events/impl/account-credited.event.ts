import { Money } from "../../value-objects/money.vo";

export class AccountCreditedEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly money: Money) {}

  readonly type = 'AccountCreditedEvent';
}
