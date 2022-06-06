export class AccountDebitedEvent {
  constructor(
    public readonly accountId: string,
    public readonly receiverAccountId: string,
    public readonly amount: number) {}

  type = 'AccountDebitedEvent';
}
