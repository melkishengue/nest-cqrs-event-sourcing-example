import { Currency } from "../../value-objects/money.vo";

export class AccountCreatedEvent {
  constructor(
    public readonly accountId: string,
    public readonly userId: string,
    public readonly currency: Currency
  ) {}

  readonly type = 'AccountCreatedEvent';
}
