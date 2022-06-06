export class GetAccountQuery {
  constructor(
    readonly userId: string,
    readonly accountId: string
  ){}
}
