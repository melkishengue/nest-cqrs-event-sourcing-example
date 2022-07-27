export class AccountDeletedEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly creationDate: string,
  ){}

  readonly type = 'AccountDeletedEvent';
}
