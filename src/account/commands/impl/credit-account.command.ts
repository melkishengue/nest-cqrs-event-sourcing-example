import { Money } from "../../value-objects/money.vo";

export class CreditAccountCommand {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly senderId: string,
    public readonly money: Money,
  ) {}
}
