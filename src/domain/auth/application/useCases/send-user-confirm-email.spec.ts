import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { fakeEmailProvider } from '@test/mocks/mocks';
import { SendUserConfirmEmail } from '@domain/auth/application/useCases/send-user-confirm-email';
import { User } from '@domain/auth/enterprise/entities/User';
import { faker } from '@faker-js/faker';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { UserEmailAlreadyConfirmed } from '@domain/auth/application/errors/UserEmailAlreadyConfirmed';

describe('SendUserConfirmEmail', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let stu: SendUserConfirmEmail;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    stu = new SendUserConfirmEmail(inMemoryUserRepository, fakeEmailProvider);
    jest.clearAllMocks();
  });

  it('should be able to send a e-mail confirm to user', async () => {
    const fakeEmail = faker.internet.email();

    const spyEmailProvider = jest.spyOn(fakeEmailProvider, 'sendConfirmEmail');

    const user = User.create({
      email: fakeEmail,
      name: faker.person.firstName(),
      passwordHash: faker.string.uuid(),
    });

    await inMemoryUserRepository.create(user);

    const results = await stu.execute({ userId: user.id });

    expect(results.isRight()).toBeTruthy();

    if (results.isRight()) {
      const { user: userResults } = results.value;

      expect(userResults.emailIsValidated).toBeFalsy();
      expect(userResults.confirmEmailCode).toBeDefined();

      expect(spyEmailProvider).toHaveBeenNthCalledWith(1, {
        email: user.email,
        confirmEmailCode: userResults.confirmEmailCode,
      });
    }
  });

  it('should not be able to send a e-mail confirm to user if user not exists', async () => {
    const results = await stu.execute({ userId: faker.string.uuid() });

    expect(results.isLeft()).toBeTruthy();

    if (results.isLeft()) {
      expect(results.value).toBeInstanceOf(UserNotFound);
    }
  });

  it('should not be able to send a e-mail confirm to user if user already confirmed', async () => {
    const spyEmailProvider = jest.spyOn(fakeEmailProvider, 'sendConfirmEmail');

    const user = User.create({
      email: faker.internet.email(),
      name: faker.person.firstName(),
      passwordHash: faker.string.uuid(),
    });

    user.emailIsValidated = true;

    await inMemoryUserRepository.create(user);

    const results = await stu.execute({ userId: user.id });

    expect(results.isLeft()).toBeTruthy();
    expect(spyEmailProvider).toHaveBeenCalledTimes(0);

    if (results.isLeft()) {
      expect(results.value).toBeInstanceOf(UserEmailAlreadyConfirmed);
    }
  });
});
