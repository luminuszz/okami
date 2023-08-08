import { describe, expect, vi, vitest } from 'vitest';
import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { faker } from '@faker-js/faker';
import { HashProvider } from '@domain/auth/application/contracts/hash-provider';
import { InMemoryUserRepository } from '../../../../../test/mocks/in-memory-user-repository';
import { UserAlreadyExists } from '@domain/auth/application/errors/UserAlreadyExists';

const fakeHashProvider: HashProvider = {
  hash: vi.fn(),
  compare: vi.fn(),
};

describe('Create User', () => {
  let stu: CreateUserUseCase;
  let hashProvider: HashProvider;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    hashProvider = fakeHashProvider;
    userRepository = new InMemoryUserRepository();

    stu = new CreateUserUseCase(fakeHashProvider, userRepository);
  });

  it('should create a user', async () => {
    const hashMethod = vitest.spyOn(hashProvider, 'hash');
    hashMethod.mockImplementation(() => Promise.resolve(faker.string.uuid()));

    const payload = {
      password: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.firstName(),
    };

    const results = await stu.execute(payload);

    expect(results.value).toBeDefined();
    expect(results.value).toHaveProperty('user');
    expect(hashMethod).toHaveBeenCalled();

    if (results.isRight()) {
      expect(results.value.user.passwordHash).not.toBe(payload.password);
    }
  });

  it('should not be able to create a User with already used email', async () => {
    const payload = {
      password: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.firstName(),
    };

    await stu.execute(payload);

    const results = await stu.execute(payload);

    expect(results.isLeft()).toBe(true);
    expect(results.value).toBeInstanceOf(UserAlreadyExists);
  });
});
