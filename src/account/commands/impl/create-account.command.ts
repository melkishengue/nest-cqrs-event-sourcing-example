import { Currency, Money } from "../../value-objects/";

export class CreateAccountCommand {
  constructor(
    public readonly userId: string,
    public readonly balance: Money,
  ) {}
}
