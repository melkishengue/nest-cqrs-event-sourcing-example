export class AccountCreatedEvent {
  constructor(
    public readonly accountId: string,
    public readonly userId: string
  ) {}

  type = 'AccountCreatedEvent';
}
