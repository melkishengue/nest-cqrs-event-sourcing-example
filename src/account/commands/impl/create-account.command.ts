import { Currency } from "../../value-objects/money.vo";

export class CreateAccountCommand {
  constructor(
    public readonly userId: string,
    public readonly currency: Currency,
  ) {}
}
