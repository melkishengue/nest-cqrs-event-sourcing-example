import { Currency } from "../../value-objects";

export class AccountUpdatedEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly currency: Currency,
    public readonly creationDate: string,
  ) {}

  readonly type = 'AccountUpdatedEvent';
}
