import { describe, expect } from 'vitest';
import { InMemoryUserRepository } from '../../../../../test/mocks/in-memory-user-repository';
import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { fakeHashProvider } from '../../../../../test/mocks/mocks';
import { FindUserByIdUseCase } from '@domain/auth/application/useCases/find-user-by-id';
import { faker } from '@faker-js/faker';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';

describe('FindUserByIdUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let stu: FindUserByIdUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    stu = new FindUserByIdUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(fakeHashProvider, inMemoryUserRepository);
  });

  it('should be ble to find user by id', async () => {
    const userResult = await createUserUseCase.execute({
      name: faker.person.firstName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
    });

    if (userResult.isLeft()) {
      throw userResult.value;
    }

    const results = await stu.execute({ id: userResult.value.user.id.toString() });

    expect(results.isRight()).toBe(true);

    if (results.isRight()) {
      expect(results.value.user.id.toString()).toBe(userResult.value.user.id.toString());
      expect(results.value.user).toHaveProperty('id');
      expect(results.value.user).toHaveProperty('email');
      expect(results.value.user).toHaveProperty('passwordHash');
    }
  });

  it('should not be ble to find user by id', async () => {
    const userResult = await createUserUseCase.execute({
      name: faker.person.firstName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
    });

    if (userResult.isLeft()) {
      throw userResult.value;
    }

    const results = await stu.execute({ id: 'FAKE_ID' });

    expect(results.isLeft()).toBe(true);
    expect(results.value).toBeInstanceOf(UserNotFound);
  });
});
