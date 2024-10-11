import { HashProvider } from '@domain/auth/application/contracts/hash-provider';
import { MailProvider } from '@domain/auth/application/contracts/mail-provider';
import { faker } from '@faker-js/faker';
import { ClientKafka } from '@nestjs/microservices';
import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { WorkProps, WorkStatus } from '@domain/work/enterprise/entities/work';

export const fakeHashProvider: HashProvider = {
  hash: jest.fn().mockImplementation(() => Promise.resolve(faker.string.uuid())),
  compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
};

export const fakeStorageProvider = {
  uploadWorkImage: jest.fn().mockImplementation(() => Promise.resolve(faker.string.uuid())),
  uploadWorkImageWithUrl: jest.fn().mockImplementation(() => Promise.resolve(faker.string.uuid())),
  uploadAvatarImage: jest.fn().mockImplementation(() => Promise.resolve(faker.string.uuid())),
};

export const fakeEmailProvider: MailProvider = {
  sendResetPasswordEmail: jest.fn().mockImplementation(() => Promise.resolve()),
  sendConfirmEmail: jest.fn().mockImplementation(() => Promise.resolve()),
  sendMail: jest.fn().mockImplementation(() => Promise.resolve()),
};

export const createWorkPropsFactory = (props?: Partial<WorkProps>) => ({
  name: faker.internet.userName(),
  url: faker.internet.url(),
  chapter: new Chapter(faker.number.int({ max: 1000, min: 1 })),
  hasNewChapter: false,
  createdAt: faker.date.recent(),
  category: faker.helpers.arrayElement(['MANGA', 'ANIME']) as any,
  userId: faker.string.uuid(),
  status: faker.helpers.arrayElement(Object.values(WorkStatus)) as any,
  ...props,
});

export const createUserPropsFactory = () => ({
  email: faker.internet.email(),
  name: faker.person.firstName(),
  passwordHash: faker.string.uuid(),
});

export const fakerMessageEmit = {
  send: jest.fn().mockImplementation(() => Promise.resolve()),
  emit: jest.fn().mockImplementation(() => Promise.resolve()),
};

export const mockKafkaClient = {
  subscribeToResponseOf: jest.fn().mockImplementation(() => Promise.resolve()),
  connect: jest.fn().mockImplementation(() => Promise.resolve()),
  emit: jest.fn().mockImplementation(() => Promise.resolve()),
  send: jest.fn().mockImplementation(() => Promise.resolve()),
} as unknown as ClientKafka;
