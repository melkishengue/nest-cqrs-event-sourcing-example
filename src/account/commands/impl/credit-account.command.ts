import { Money } from "../../value-objects/";

export class CreditAccountCommand {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly senderId: string,
    public readonly money: Money,
  ) {}
}
