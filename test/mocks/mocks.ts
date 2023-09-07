import { HashProvider } from '@domain/auth/application/contracts/hash-provider';
import { faker } from '@faker-js/faker';

export const fakeHashProvider: HashProvider = {
  hash: jest.fn().mockImplementation(() => Promise.resolve(faker.string.uuid())),
  compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
};
