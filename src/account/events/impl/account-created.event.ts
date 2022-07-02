import { Currency } from "../../value-objects/";

export class AccountCreatedEvent {
  constructor(
    public readonly accountId: string,
    public readonly userId: string,
    public readonly currency: Currency
  ) {}

  readonly type = 'AccountCreatedEvent';
}
