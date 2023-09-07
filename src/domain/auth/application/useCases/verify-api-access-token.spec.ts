import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { fakeHashProvider } from '@test/mocks/mocks';
import { CreateApiAccessTokenUseCase } from '@domain/auth/application/useCases/create-api-access-token-use-case';
import { InMemoryAccessTokenRepository } from '@test/mocks/in-memory-access-token-repository';
import { faker } from '@faker-js/faker';
import { VerifyApiAccessTokenUseCase } from '@domain/auth/application/useCases/verify-api-access-token-use-case';
import { TokenNotFoundError, TokenRevokedError } from '@domain/auth/application/errors/Token';

describe('VerifyApiAccessToken', () => {
  let createUser: CreateUserUseCase;
  let userRepository: InMemoryUserRepository;
  let stu: VerifyApiAccessTokenUseCase;
  let accessTokenRepository: InMemoryAccessTokenRepository;
  let createToken: CreateApiAccessTokenUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    createUser = new CreateUserUseCase(fakeHashProvider, userRepository);
    accessTokenRepository = new InMemoryAccessTokenRepository();
    stu = new VerifyApiAccessTokenUseCase(accessTokenRepository);
    createToken = new CreateApiAccessTokenUseCase(userRepository, accessTokenRepository);
  });

  it('should be able to validate a token', async () => {
    const userResults = await createUser.execute({
      password: faker.internet.password(),
      name: faker.person.firstName(),
      email: faker.internet.email(),
    });

    if (userResults.isLeft()) {
      throw userResults.value;
    }

    const accessTokenResults = await createToken.execute({
      user_id: userResults.value.user.id,
    });

    if (accessTokenResults.isLeft()) {
      throw accessTokenResults.value;
    }

    const { accessToken } = accessTokenResults.value;

    const results = await stu.execute({ token: accessToken.token });

    expect(results.isRight()).toBe(true);
    expect(results.value).toEqual({ isValid: true });
  });

  it('should not be able to validate a token if token not exists', async () => {
    const userResults = await createUser.execute({
      password: faker.internet.password(),
      name: faker.person.firstName(),
      email: faker.internet.email(),
    });

    if (userResults.isLeft()) {
      throw userResults.value;
    }

    const accessTokenResults = await createToken.execute({
      user_id: userResults.value.user.id,
    });

    if (accessTokenResults.isLeft()) {
      throw accessTokenResults.value;
    }

    const results = await stu.execute({ token: 'FAKE TOKEN' });

    expect(results.isLeft()).toBe(true);
    expect(results.value).toBeInstanceOf(TokenNotFoundError);
  });
  it('should not be able to validate a token if token is revoked', async () => {
    const userResults = await createUser.execute({
      password: faker.internet.password(),
      name: faker.person.firstName(),
      email: faker.internet.email(),
    });

    if (userResults.isLeft()) {
      throw userResults.value;
    }

    const accessTokenResults = await createToken.execute({
      user_id: userResults.value.user.id,
    });

    if (accessTokenResults.isLeft()) {
      throw accessTokenResults.value;
    }

    const { token } = accessTokenResults.value.accessToken;

    accessTokenRepository.tokens[0].revokedAt = new Date();

    const results = await stu.execute({ token });

    expect(results.isLeft()).toBe(true);
    expect(results.value).toBeInstanceOf(TokenRevokedError);
  });
});
