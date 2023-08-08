import { beforeEach, expect } from 'vitest';
import { AuthenticateUserUseCase } from '@domain/auth/application/useCases/authenticate-user';
import { faker } from '@faker-js/faker';
import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { InMemoryUserRepository } from '../../../../../test/mocks/in-memory-user-repository';
import { HashProvider } from '@domain/auth/application/contracts/hash-provider';
import { fakeHashProvider } from '../../../../../test/mocks/mocks';

describe('AuthenticateUser', () => {
  let stu: AuthenticateUserUseCase;
  let createUser: CreateUserUseCase;
  let userRepository: InMemoryUserRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    hashProvider = fakeHashProvider;
    createUser = new CreateUserUseCase(hashProvider, userRepository);
    stu = new AuthenticateUserUseCase(hashProvider, userRepository);
  });

  it('should be able to authenticate a user', async () => {
    const authPayload = {
      email: faker.internet.email(),
      password: faker.string.uuid(),
    };

    const spy = vi.spyOn(hashProvider, 'compare');

    const userPayload = {
      name: faker.person.firstName(),
      ...authPayload,
    };

    await createUser.execute(userPayload);

    const results = await stu.execute(authPayload);

    expect(results.isRight()).toBe(true);
    expect(results.value).toHaveProperty('user');
    if (results.isRight()) {
      expect(results.value.isAuthenticated).toBe(true);
    }

    expect(spy).toHaveBeenCalled();
  });
});
