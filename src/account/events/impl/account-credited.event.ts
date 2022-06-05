export class AccountCreditedEvent {
  constructor(
    public readonly accountId: string,
    public readonly amount: number) {}

  type = 'AccountCreditedEvent';
}
