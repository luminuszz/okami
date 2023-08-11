import { describe, expect, vi } from 'vitest';
import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { InMemoryUserRepository } from '../../../../../test/mocks/in-memory-user-repository';
import { fakeHashProvider } from '../../../../../test/mocks/mocks';
import { CreateApiAccessToken } from '@domain/auth/application/useCases/create-api-access-token';
import { InMemoryAccessTokenRepository } from '../../../../../test/mocks/in-memory-access-token-repository';
import { faker } from '@faker-js/faker';

describe('CreateApiAccessToken', () => {
  let createUser: CreateUserUseCase;
  let userRepository: InMemoryUserRepository;
  let stu: CreateApiAccessToken;
  let accessTokenRepository: InMemoryAccessTokenRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    createUser = new CreateUserUseCase(fakeHashProvider, userRepository);
    accessTokenRepository = new InMemoryAccessTokenRepository();
    stu = new CreateApiAccessToken(userRepository, accessTokenRepository);
  });

  it('should be to create a access token', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1000);

    const userResults = await createUser.execute({
      password: faker.internet.password(),
      name: faker.person.firstName(),
      email: faker.internet.email(),
    });

    if (userResults.isLeft()) {
      throw userResults.value;
    }

    const results = await stu.execute({
      user_id: userResults.value.user.id,
    });

    expect(results.isRight()).toBe(true);

    if (results.isRight()) {
      expect(results.value.accessToken.token).includes(userResults.value.user.id);
      expect(results.value.accessToken.token).includes('--');
      expect(results.value.accessToken.token).includes(1000);
    }
  });
});
