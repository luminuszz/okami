import { InMemoryRefreshTokenRepository } from '@test/mocks/in-memory-refresh-token-repository';
import { InvalidateRefreshToken } from '@domain/auth/application/useCases/invalidate-refresh-token';
import { RefreshToken } from '@domain/auth/enterprise/entities/RefreshToken';
import { faker } from '@faker-js/faker';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { RefreshTokenAlreadyInvalidated } from '@domain/auth/application/errors/RefreshTokenAlreadyInvalidated';

describe('InvalidateRefreshToken', () => {
  let refreshTokenRepository: InMemoryRefreshTokenRepository;
  let stu: InvalidateRefreshToken;

  beforeEach(() => {
    refreshTokenRepository = new InMemoryRefreshTokenRepository();
    stu = new InvalidateRefreshToken(refreshTokenRepository);
  });

  it('should invalidate a refresh token', async () => {
    const refreshToken = RefreshToken.create({
      token: faker.string.uuid(),
      createdAt: new Date(),
      expiresAt: faker.date.future({ refDate: new Date() }).getTime(),
      userId: faker.string.uuid(),
      invalidatedAt: null,
    });

    await refreshTokenRepository.create(refreshToken);

    const response = await stu.execute({ refreshToken: refreshToken.token });

    console.log(response.value);

    expect(response.isRight()).toBeTruthy();
    expect(refreshTokenRepository.refreshTokens[0].isInvalidated).toBeTruthy();
    expect(refreshTokenRepository.refreshTokens[0].isExpired).toBeFalsy();
    expect(refreshTokenRepository.refreshTokens[0].invalidatedAt).not.toBeNull();
  });

  it("should not be able to invalidate a refresh token that doesn't exist", async () => {
    const response = await stu.execute({ refreshToken: faker.string.uuid() });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(ResourceNotFound);
  });

  it('should not be able to invalidate a refresh token is already invalidated', async () => {
    const refreshToken = RefreshToken.create({
      token: faker.string.uuid(),
      createdAt: new Date(),
      expiresAt: faker.date.future({ refDate: new Date() }).getTime(),
      userId: faker.string.uuid(),
      invalidatedAt: faker.date.past(),
    });

    await refreshTokenRepository.create(refreshToken);

    const response = await stu.execute({ refreshToken: refreshToken.token });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(RefreshTokenAlreadyInvalidated);
  });

  it('should not be able to invalidate a refresh token is expired', async () => {
    const refreshToken = RefreshToken.create({
      token: faker.string.uuid(),
      createdAt: new Date(),
      expiresAt: faker.date.past().getTime(),
      userId: faker.string.uuid(),
      invalidatedAt: null,
    });

    await refreshTokenRepository.create(refreshToken);

    const response = await stu.execute({ refreshToken: refreshToken.token });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(RefreshTokenAlreadyInvalidated);
  });
});
