export enum Currency {
  Fcfa = 'XAF', Euro = 'EUR', Dollar = 'USD'
}

export class Money {
  constructor(private amount: number, private currency: Currency) {}

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
    return new Money(this.amount + convertedMoney.getAmount(), this.currency)
  }
  
  decreaseAmount(deltaMoney: Money) {
    if (!this.canBeDecreasedOf(deltaMoney)) {
      throw new Error('There is not such a thing as negative money');
    }

    let convertedMoney = Money.convertToCurrency(deltaMoney, this.currency);

    return new Money(this.amount - convertedMoney.getAmount(), this.currency)
  }

  static convertToCurrency(money: Money, currency: Currency): Money {
    if (money.getCurrency() === currency) {
      return new Money(money.getAmount(), money.getCurrency());
    }

    let convertedMoney: Money;
    if (currency === Currency.Dollar) {
      convertedMoney = money.toDollar();
    }

    if (currency === Currency.Fcfa) {
      convertedMoney = money.toFcfa();
    }

    if (currency === Currency.Euro) {
      convertedMoney = money.toEuro();
    }

    return convertedMoney;
  }

  toFcfa() {
    const convertionTable = {
      [Currency.Fcfa]: 1,
      [Currency.Euro]: 650,
      [Currency.Dollar]: 500
    }
    let rate = convertionTable[this.currency];

    if (!rate) {
      throw new Error(`Tried to convert into unknown currency ${this.currency}`);
    }

    return new Money(this.amount*rate, Currency.Fcfa);
  }

  toEuro() {
    const convertionTable = {
      [Currency.Euro]: 1,
      [Currency.Fcfa]: 1/650,
      [Currency.Dollar]: 0.96
    }
    let rate = convertionTable[this.currency];

    if (!rate) {
      throw new Error(`Tried to convert into unknown currency ${this.currency}`);
    }

    return new Money(this.amount*rate, Currency.Euro);
  }

  toDollar() {
    const convertionTable = {
      [Currency.Euro]: 1.04,
      [Currency.Fcfa]: 1/500,
      [Currency.Dollar]: 1
    }
    let rate = convertionTable[this.currency];

    if (!rate) {
      throw new Error(`Tried to convert into unknown currency ${this.currency}`);
    }

    return new Money(this.amount*rate, Currency.Dollar);
  }
}