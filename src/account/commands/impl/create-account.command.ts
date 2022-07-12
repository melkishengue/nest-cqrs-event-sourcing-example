import { Currency, Id, Money } from "../../value-objects/";

export class CreateAccountCommand {
  constructor(
    public readonly userId: Id,
    public readonly balance: Money,
  ) {}
}
