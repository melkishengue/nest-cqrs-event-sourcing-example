import { Id, Money } from "../../value-objects";

export class DebitAccountCommand {
  constructor(
    public userId: Id,
    public accountId: Id,
    public receiverAccountId: Id,
    public receiverUserId: Id,
    public money: Money) {}
}
