import { Currency } from "../../value-objects/";

export class CreateAccountCommand {
  constructor(
    public readonly userId: string,
    public readonly currency: Currency,
  ) {}
}
