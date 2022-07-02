import { Money } from "../../value-objects/money.vo";

export class DebitAccountCommand {
  constructor(
    public userId: string,
    public accountId: string,
    public receiverAccountId: string,
    public money: Money) {}
}
