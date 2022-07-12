import { Currency, Id, Money } from "../../value-objects";

export class UpdateAccountCommand {
  constructor(
    public readonly accountId: Id,
    public readonly userId: Id,
    public readonly currency?: Currency,
    public readonly balance?: Money,
  ) {}
}
