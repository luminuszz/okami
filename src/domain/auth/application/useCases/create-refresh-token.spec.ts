import { User } from '@domain/auth/enterprise/entities/User';
import { faker } from '@faker-js/faker';
import { InMemoryRefreshTokenRepository } from '@test/mocks/in-memory-refresh-token-repository';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { fakeHashProvider } from '@test/mocks/mocks';
import { UserNotFound } from '../errors/UserNotFound';
import { CreateRefreshTokenUseCase } from './create-refresh-token';

describe('CreateRefreshToken', () => {
  let stu: CreateRefreshTokenUseCase;
  let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository;
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository();
    inMemoryUserRepository = new InMemoryUserRepository();

    stu = new CreateRefreshTokenUseCase(fakeHashProvider, inMemoryRefreshTokenRepository, inMemoryUserRepository);
  });

  it('should be able to create a refresh token', async () => {
    const user = User.create({
      email: faker.internet.email(),
      name: faker.person.firstName(),
      passwordHash: faker.string.uuid(),
    });

    await inMemoryUserRepository.create(user);

    const results = await stu.execute({ userId: user.id });

    expect(results.isRight()).toBeTruthy();

    if (results.isRight()) {
      expect(results.value).toBeDefined();
      expect(results.value).toHaveProperty('token');
      expect(results.value).toHaveProperty('userId');
      expect(results.value.userId).toBe(user.id);
    }
  });

  it('should not be able to create a refresh token if user not exists', async () => {
    const results = await stu.execute({ userId: faker.string.uuid() });

    expect(results.isLeft()).toBeTruthy();
    expect(results.value).toBeInstanceOf(UserNotFound);
  });
});
