export class AccountDebitedEvent {
  constructor(
    public readonly accountId: string,
    public readonly receiverId: string,
    public readonly amount: number) {}

  type = 'AccountDebitedEvent';
}
