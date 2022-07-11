import { MoneyDto } from "../../dto";
import { Currency } from "../../value-objects";

export class AccountUpdatedEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly currency: Currency,
    public readonly balance: MoneyDto,
    public readonly creationDate: string,
  ) {}

  readonly type = 'AccountUpdatedEvent';
}
