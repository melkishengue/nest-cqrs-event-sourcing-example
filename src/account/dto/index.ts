import { Currency } from "../value-objects";

export interface DebitAccountDto {
  userId: string,
  money: {
    amount: number,
    currency: Currency,
  };
  receiverAccountId: string
}

export interface CreateAccountDto {
  userId: string,
  currency: Currency,
  balance?: {
    amount: number, currency: Currency
  },
}

export type UpdateAccountDto = Partial<CreateAccountDto>

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