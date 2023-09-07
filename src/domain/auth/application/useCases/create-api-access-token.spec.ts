import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { fakeHashProvider } from '@test/mocks/mocks';
import { CreateApiAccessTokenUseCase } from '@domain/auth/application/useCases/create-api-access-token-use-case';
import { InMemoryAccessTokenRepository } from '@test/mocks/in-memory-access-token-repository';
import { faker } from '@faker-js/faker';

describe('CreateApiAccessToken', () => {
  let createUser: CreateUserUseCase;
  let userRepository: InMemoryUserRepository;
  let stu: CreateApiAccessTokenUseCase;
  let accessTokenRepository: InMemoryAccessTokenRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    createUser = new CreateUserUseCase(fakeHashProvider, userRepository);
    accessTokenRepository = new InMemoryAccessTokenRepository();
    stu = new CreateApiAccessTokenUseCase(userRepository, accessTokenRepository);
  });

  it('should be to create a access token', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);

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
      expect(results.value.accessToken.token.includes(userResults.value.user.id)).toBeTruthy();
      expect(results.value.accessToken.token.includes('--')).toBeTruthy();
      expect(results.value.accessToken.token.includes('1000')).toBeTruthy();
    }
  });
});
