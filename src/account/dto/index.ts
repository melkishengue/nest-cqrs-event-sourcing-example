import { Currency } from "../value-objects";

export interface MoneyDto {
  amount: number, currency: Currency
}

export interface DebitAccountDto {
  userId: string,
  money: {
    amount: number,
    currency: Currency,
  };
  receiverAccountId: string,
  receiverUserId: string,
}

export interface CreateAccountDto {
  userId: string,
  balance?: MoneyDto,
}

export type UpdateAccountDto = Partial<CreateAccountDto & { currency?: Currency, }>

export interface DeleteAccountDto {
  userId: string,
}

export interface GetAccountDto {
  userId: string,
  accountId: string
}

export interface GetUserDto {
  userId: string,
}