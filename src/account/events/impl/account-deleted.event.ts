export class AccountDeletedEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
  ){}

  type = 'AccountDeletedEvent';
}
