export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly createdAt: string, ) {}
}

export type ClientUser = Omit<User, 'password'>;