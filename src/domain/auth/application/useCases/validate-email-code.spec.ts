import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { ValidateEmailCode } from '@domain/auth/application/useCases/validate-email-code';
import { createUserPropsFactory } from '@test/mocks/mocks';
import { User } from '@domain/auth/enterprise/entities/User';
import { InvalidCodeKey } from '@domain/auth/application/errors/InvalidCodeKey';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

describe('ValidateEmailCode', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let stu: ValidateEmailCode;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    stu = new ValidateEmailCode(inMemoryUserRepository);
  });

  it('should be able to validate email code', async () => {
    const user = User.create(createUserPropsFactory());

    const code = '123456';

    user.emailValidationCode = code;

    await inMemoryUserRepository.create(user);

    const results = await stu.execute({ id: user.id, code });

    expect(results.isRight()).toBeTruthy();

    if (results.isRight()) {
      expect(results.value.user.emailValidationCode).toBeUndefined();
      expect(results.value.user.isEmailValidated).toBe(true);
    }
  });

  it('should not be able to validate email code if code is wrong', async () => {
    const user = User.create(createUserPropsFactory());

    user.emailValidationCode = faker.string.uuid();

    await inMemoryUserRepository.create(user);

    const results = await stu.execute({ id: user.id, code: 'FAKE_CODE' });

    expect(results.isLeft()).toBeTruthy();

    if (results.isLeft()) {
      expect(results.value).toBeInstanceOf(InvalidCodeKey);
    }
  });

  it('should not be able to validate email code if code is expired', async () => {
    const user = User.create(createUserPropsFactory());

    const code = faker.string.uuid();

    user.emailValidationCode = code;

    await inMemoryUserRepository.create(user);

    jest.setSystemTime(dayjs().set('day', 10).toDate());

    const results = await stu.execute({ id: user.id, code });

    expect(results.isLeft()).toBeTruthy();

    if (results.isLeft()) {
      expect(results.value).toBeInstanceOf(InvalidCodeKey);
    }
  });
});
