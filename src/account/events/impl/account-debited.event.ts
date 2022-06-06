export class AccountDebitedEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly receiverAccountId: string,
    public readonly amount: number) {}

  type = 'AccountDebitedEvent';
}
