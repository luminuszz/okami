import { User } from '@domain/auth/enterprise/entities/User';
import { faker } from '@faker-js/faker';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { createUserPropsFactory, fakeEmailProvider } from '@test/mocks/mocks';
import { UserNotFound } from '../errors/UserNotFound';
import { SendResetPasswordEmail } from './send-reset-password-email';

describe('SendResetPasswordEmail', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let stu: SendResetPasswordEmail;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    stu = new SendResetPasswordEmail(inMemoryUserRepository, fakeEmailProvider);

    jest.clearAllMocks();
  });

  it('should be able to send a reset password e-mail to user', async () => {
    const user = User.create(createUserPropsFactory());

    const spy = jest.spyOn(fakeEmailProvider, 'sendResetPasswordEmail');

    await inMemoryUserRepository.create(user);

    const results = await stu.execute({
      email: user.email,
    });

    expect(results.isRight()).toBe(true);

    if (results.isRight()) {
      expect(results.value.user.resetPasswordCode).toBeDefined();
      expect(spy).toHaveBeenNthCalledWith(1, {
        email: user.email,
        resetPasswordCode: results.value.user.resetPasswordCode,
      });
    }
  });

  it('should  not be able send a e-mail if user not exists', async () => {
    const user = User.create(createUserPropsFactory());

    const spy = jest.spyOn(fakeEmailProvider, 'sendResetPasswordEmail');

    await inMemoryUserRepository.create(user);

    const fakeEmail = faker.internet.email();

    const results = await stu.execute({
      email: fakeEmail,
    });

    expect(results.isLeft()).toBe(true);

    expect(results.value).toBeInstanceOf(UserNotFound);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
