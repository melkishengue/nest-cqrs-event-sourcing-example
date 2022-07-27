import { v4 as uuid } from 'uuid';

export class Id {
  constructor(private readonly value: string) {
    if (!value) {
      throw new Error(`Tried to create empty id.`);
    }
  }

  getValue(): string {
    return this.value;
  }

  static create(): Id {
    return new Id(uuid());
  }

  static fromString(value: string): Id {
    return new Id(value);
  }
}
