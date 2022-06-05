export class DebitAccountCommand {
  constructor(public readonly accountId: string, public readonly receiverId: string, public readonly amount: number) {}
}
