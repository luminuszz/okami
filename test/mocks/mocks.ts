import { HashProvider } from '@domain/auth/application/contracts/hash-provider';
import { vi } from 'vitest';
import { faker } from '@faker-js/faker';

export const fakeHashProvider: HashProvider = {
  hash: vi.fn().mockImplementation(() => Promise.resolve(faker.string.uuid())),
  compare: vi.fn().mockImplementation(() => Promise.resolve(true)),
};
