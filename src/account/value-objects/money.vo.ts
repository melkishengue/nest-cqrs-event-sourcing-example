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
    let convertedMoney = this.convertToCurrentCurrency(deltaMoney);
    const newAmount = this.amount - convertedMoney.getAmount();

    return newAmount >= 0;
  }

  increaseAmount(deltaMoney: Money) {
    let convertedMoney = this.convertToCurrentCurrency(deltaMoney);
    this.amount += convertedMoney.getAmount();
  }
  
  decreaseAmount(deltaMoney: Money) {
    let convertedMoney: Money = this.convertToCurrentCurrency(deltaMoney);
    const newAmount = this.amount - convertedMoney.getAmount();

    if (newAmount < 0) {
      throw new Error('There is not such a thing as negative money');
    }

    this.amount = newAmount;
  }

  private convertToCurrentCurrency(money: Money): Money {
    if (money.getCurrency() === this.currency) {
      return new Money(money.getAmount(), money.getCurrency());
    }

    let convertedMoney: Money;
    if (this.currency === Currency.Dollar) {
      convertedMoney = money.toDollar();
    }

    if (this.currency === Currency.Fcfa) {
      convertedMoney = money.toFcfa();
    }

    if (this.currency === Currency.Euro) {
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