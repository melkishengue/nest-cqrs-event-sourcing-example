import { Id } from "../../value-objects";

export class DeleteAccountCommand {
  constructor(
    public readonly userId: Id,
    public readonly accountId: Id
  ) {}
}
