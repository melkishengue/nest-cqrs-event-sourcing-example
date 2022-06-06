export class AccountCreditedEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly amount: number) {}

  type = 'AccountCreditedEvent';
}
