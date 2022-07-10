import { Currency, Money } from "../../value-objects/";

export class AccountCreatedEvent {
  constructor(
    public readonly accountId: string,
    public readonly userId: string,
    public readonly currency: Currency,
    public readonly balance: Money,
    public readonly creationDate: string,
  ) {}

  readonly type = 'AccountCreatedEvent';
}
