import { User } from '@domain/auth/enterprise/entities/User';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { createUserPropsFactory, fakeEmailProvider } from '@test/mocks/mocks';
import { UserNotFound } from '../errors/UserNotFound';
import { SendConfirmEmail } from './send-confirm-email';

describe('SendConfirmEmail', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let stu: SendConfirmEmail;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    stu = new SendConfirmEmail(inMemoryUserRepository, fakeEmailProvider);

    jest.clearAllMocks();
  });

  it('should be able to send a confirm e-mail to user', async () => {
    const user = User.create(createUserPropsFactory());

    const spy = jest.spyOn(fakeEmailProvider, 'sendConfirmEmail');

    await inMemoryUserRepository.create(user);

    const results = await stu.execute({ userId: user.id });

    expect(results.isRight()).toBe(true);

    if (results.isLeft()) {
      throw results.value;
    }

    expect(results.isRight()).toBe(true);

    const { user: updatedUser } = results.value;

    expect(updatedUser.emailValidatedCode.isEmailValidated()).toBe(false);
    expect(updatedUser.emailValidatedCode.getCode()).not.toBeNull();
    expect(spy).toBeCalledTimes(1);
  });

  it('should not be able to send a reset password e-mail to updatedUser if user not found', async () => {
    const user = User.create(createUserPropsFactory());

    await inMemoryUserRepository.create(user);

    const results = await stu.execute({ userId: 'FAKE_ID' });

    expect(results.isLeft()).toBe(true);
    expect(results.value).toBeInstanceOf(UserNotFound);
  });
});
