import { Currency, Money } from "../../value-objects";

export class UpdateAccountCommand {
  constructor(
    public readonly accountId: string,
    public readonly userId: string,
    public readonly currency?: Currency,
    public readonly balance?: Money,
  ) {}
}
