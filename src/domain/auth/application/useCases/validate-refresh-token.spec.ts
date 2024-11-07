import { InvalidOperation } from '@core/errors/invalid-operation';
import { RefreshToken } from '@domain/auth/enterprise/entities/RefreshToken';
import { User } from '@domain/auth/enterprise/entities/User';
import { faker } from '@faker-js/faker';
import { InMemoryRefreshTokenRepository } from '@test/mocks/in-memory-refresh-token-repository';
import dayjs from 'dayjs';
import { ValidateRefreshToken } from './validate-refresh-token';

describe('ValidateRefreshToken', () => {
  let stu: ValidateRefreshToken;
  let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository;

  beforeEach(() => {
    inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository();

    stu = new ValidateRefreshToken(inMemoryRefreshTokenRepository);
  });

  it('should be able to validate a refresh token', async () => {
    const user = User.create({
      email: faker.internet.email(),
      name: faker.person.firstName(),
      passwordHash: faker.string.uuid(),
    });

    const token = faker.string.uuid();

    await inMemoryRefreshTokenRepository.create(
      RefreshToken.create({
        expiresAt: dayjs().add(30, 'days').unix(),
        token,
        userId: user.id,
      }),
    );

    const results = await stu.execute({ refreshToken: token });

    expect(results.isRight()).toBeTruthy();
    expect(results.value).toHaveProperty('refreshToken');
  });

  it('should not be able to validate a refresh token if token not found', async () => {
    const user = User.create({
      email: faker.internet.email(),
      name: faker.person.firstName(),
      passwordHash: faker.string.uuid(),
    });

    const token = faker.string.uuid();

    await inMemoryRefreshTokenRepository.create(
      RefreshToken.create({
        expiresAt: dayjs().add(30, 'days').unix(),
        token,
        userId: user.id,
      }),
    );

    const results = await stu.execute({ refreshToken: 'FAKE_TOKEN' });

    expect(results.isLeft()).toBeTruthy();
    expect(results.value).toBeInstanceOf(InvalidOperation);
  });

  it('should not be able to validate a refresh token if refresh token expired', async () => {
    const user = User.create({
      email: faker.internet.email(),
      name: faker.person.firstName(),
      passwordHash: faker.string.uuid(),
    });

    const token = faker.string.uuid();

    await inMemoryRefreshTokenRepository.create(
      RefreshToken.create({
        expiresAt: dayjs().subtract(1, 'second').unix(),
        token,
        userId: user.id,
      }),
    );

    const results = await stu.execute({ refreshToken: token });

    expect(results.isLeft()).toBeTruthy();
    expect(results.value).toBeInstanceOf(InvalidOperation);
  });
});
