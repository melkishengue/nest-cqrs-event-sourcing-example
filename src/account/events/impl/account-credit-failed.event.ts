export class AccountCreditFailedEvent {
  constructor(
    public readonly accountId: string,
    public readonly receiverAccountId: string,
    public readonly amount: number) {}

  type = 'AccountCreditFailedEvent';
}
