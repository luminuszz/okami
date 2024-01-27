import { HashProvider } from '@domain/auth/application/contracts/hash-provider';
import { faker } from '@faker-js/faker';

export const fakeHashProvider: HashProvider = {
  hash: jest.fn().mockImplementation(() => Promise.resolve(faker.string.uuid())),
  compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
};

export const createWorkPropsFactory = () => ({
  name: faker.internet.userName(),
  url: faker.internet.url(),
  chapter: faker.number.int({ max: 1000, min: 1 }),
  hasNewChapter: false,
  createdAt: faker.date.recent(),
  category: faker.helpers.arrayElement(['MANGA', 'ANIME']) as any,
  userId: faker.string.uuid(),
});
