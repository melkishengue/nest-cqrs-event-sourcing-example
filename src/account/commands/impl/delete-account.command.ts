export class DeleteAccountCommand {
  constructor(
    public readonly userId: string,
    public readonly accountId: string
  ) {}
}
