export class GetUserAccountQuery {
  constructor(
    readonly userId: string,
    readonly accountId: string,
  ){}
}
