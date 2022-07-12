import { Id, Money } from "../../value-objects/";

export class CreditAccountCommand {
  constructor(
    public readonly userId: Id,
    public readonly accountId: Id,
    public readonly senderId: Id,
    public readonly money: Money,
  ) {}
}
