import { User } from '@domain/auth/enterprise/entities/User';
import { faker } from '@faker-js/faker';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { createUserPropsFactory, fakeEmailProvider, fakeHashProvider } from '@test/mocks/mocks';
import { UserNotFound } from '../errors/UserNotFound';
import { ResetUserPassword } from './reset-user-password';

describe('SendResetPasswordEmail', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let stu: ResetUserPassword;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    stu = new ResetUserPassword(inMemoryUserRepository, fakeHashProvider);
    jest.clearAllMocks();
  });

  it('should be able to reset user password', async () => {
    const fakePassword = faker.internet.password();

    const spy = jest.spyOn(fakeHashProvider, 'hash');

    const resetPasswordCode = faker.string.uuid();

    const user = User.create({ ...createUserPropsFactory(), passwordHash: fakePassword, resetPasswordCode });

    await inMemoryUserRepository.create(user);

    const results = await stu.execute({
      newPassword: faker.internet.password(),
      resetPasswordCode,
    });

    expect(results.isRight()).toBe(true);

    if (results.isRight()) {
      const { user } = results.value;
      expect(user.resetPasswordCode).toBeNull();
      expect(spy).toBeCalledTimes(1);
      expect(user.passwordHash).not.toBe(fakePassword);
    }
  });

  it('should not be able to reset user password with passwordResetCode not found', async () => {
    const user = User.create(createUserPropsFactory());

    const spy = jest.spyOn(fakeEmailProvider, 'sendResetPasswordEmail');

    await inMemoryUserRepository.create(user);

    const results = await stu.execute({
      newPassword: faker.internet.password(),
      resetPasswordCode: faker.string.uuid(),
    });

    expect(results.isLeft()).toBe(true);

    expect(results.value).toBeInstanceOf(UserNotFound);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
