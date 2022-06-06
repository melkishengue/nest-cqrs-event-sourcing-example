export class AccountDeletedEvent {
  constructor(
    public readonly accountId: string,
  ){}

  type = 'AccountDeletedEvent';
}
