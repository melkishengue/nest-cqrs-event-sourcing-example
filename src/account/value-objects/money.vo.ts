import { MoneyDto } from "../dto";

export enum Currency {
  Fcfa = 'XAF', Euro = 'EUR', Dollar = 'USD'
}

export class Money {
  constructor(private readonly amount: number, private readonly currency: Currency) {
    if (amount < 0) {
      throw new Error(`Tried to create negative money: ${amount}`);
    }

    if (!Object.values(Currency).includes(currency)) {
      throw new Error(`Unknown currency ${currency}`);
    }
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): Currency {
    return this.currency;
  }

  canBeDecreasedOf(deltaMoney: Money): boolean {
    let convertedMoney = Money.convertToCurrency(deltaMoney, this.currency);
    const newAmount = this.amount - convertedMoney.getAmount();

    return newAmount >= 0;
  }

  increaseAmount(deltaMoney: Money): Money {
    let convertedMoney = Money.convertToCurrency(deltaMoney, this.currency);
    return Money.create(this.amount + convertedMoney.getAmount(), this.currency);
  }
  
  decreaseAmount(deltaMoney: Money): Money {
    if (!this.canBeDecreasedOf(deltaMoney)) {
      throw new Error('There is not such a thing as negative money');
    }

    let convertedMoney = Money.convertToCurrency(deltaMoney, this.currency);

    return Money.create(this.amount - convertedMoney.getAmount(), this.currency);
  }

  toFcfa(): Money {
    const convertionTable = {
      [Currency.Fcfa]: 1,
      [Currency.Euro]: 650,
      [Currency.Dollar]: 500
    }
    let rate = convertionTable[this.currency];

    if (!rate) {
      throw new Error(`Tried to convert into unknown currency ${this.currency}`);
    }

    return Money.create(this.amount*rate, Currency.Fcfa);
  }

  toEuro(): Money {
    const convertionTable = {
      [Currency.Euro]: 1,
      [Currency.Fcfa]: 1/650,
      [Currency.Dollar]: 0.96
    }
    let rate = convertionTable[this.currency];

    if (!rate) {
      throw new Error(`Tried to convert into unknown currency ${this.currency}`);
    }

    return Money.create(this.amount*rate, Currency.Euro);
  }

  toDollar(): Money {
    const convertionTable = {
      [Currency.Euro]: 1.04,
      [Currency.Fcfa]: 1/500,
      [Currency.Dollar]: 1
    };
    let rate = convertionTable[this.currency];

    if (!rate) {
      throw new Error(`Tried to convert into unknown currency ${this.currency}`);
    }

    return Money.create(this.amount*rate, Currency.Dollar);
  }

  static create(amount: number, currency: Currency): Money {
    return new Money(amount, currency);
  }

  static fromDto(moneyDto: MoneyDto): Money {
    return new Money(moneyDto.amount, moneyDto.currency);
  }

  static convertToCurrency(money: Money, destinationCurrency: Currency): Money {
    if (money.getCurrency() === destinationCurrency) {
      return Money.create(money.getAmount(), money.getCurrency());
    }

    let convertedMoney: Money;
    if (destinationCurrency === Currency.Dollar) {
      convertedMoney = money.toDollar();
    }

    if (destinationCurrency === Currency.Fcfa) {
      convertedMoney = money.toFcfa();
    }

    if (destinationCurrency === Currency.Euro) {
      convertedMoney = money.toEuro();
    }

    return convertedMoney;
  }
}
