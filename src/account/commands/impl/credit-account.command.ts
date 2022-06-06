export class CreditAccountCommand {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly senderId: string,
    public readonly amount: number
  ) {}
}
