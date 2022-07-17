import { faker } from '@faker-js/faker';
import { Id } from './id.vo';

describe('Id VO', () => {
  it('should throw exception if no value/falsy passed', () => {
    const t = () => {
      const id = new Id('');
    };
    expect(t).toThrow(Error);

    const t2 = () => {
      const id = Id.fromString('');
    };
    expect(t2).toThrow(Error);
  });

  it('should instantiate objects', () => {
    const value = faker.lorem.word();
    const id = new Id(value);
    expect(id).toBeDefined();
    expect(id.getValue()).not.toBe('');
    expect(id.getValue()).toBe(value);
  });

  it('should create new objects using the create method', () => {
    const id = Id.create();
    expect(id).toBeDefined();
    expect(typeof id).toBe('object');
    expect(typeof id.getValue()).toBe('string');
  });

  it('should create from string using fromString method', () => {
    const value = faker.lorem.word();
    const id = Id.fromString(value);

    expect(id).toBeDefined();
    expect(typeof id).toBe('object');
    expect(typeof id.getValue()).toBe('string');
    expect(id.getValue()).toBe(value);
  });
});