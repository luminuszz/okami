import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { HashProvider } from '@domain/auth/application/contracts/hash-provider';
import { SetAdminHashCodeKeyUseCase } from '@domain/auth/application/useCases/set-admin-hash-code-key';
import { fakeHashProvider } from '@test/mocks/mocks';
import { faker } from '@faker-js/faker';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { ResetUserPasswordByAdminCodeKey } from '@domain/auth/application/useCases/reset-user-password-by-admin-code-key';
import { InvalidCodeKey } from '@domain/auth/application/errors/InvalidCodeKey';

describe('ResetUserPasswordByAdminCodeKey', () => {
  let createUser: CreateUserUseCase;
  let userRepository: InMemoryUserRepository;
  let hashProvider: HashProvider;
  let stu: ResetUserPasswordByAdminCodeKey;
  let setAdminHashCodeKeyUseCase: SetAdminHashCodeKeyUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    hashProvider = fakeHashProvider;
    createUser = new CreateUserUseCase(hashProvider, userRepository);
    stu = new ResetUserPasswordByAdminCodeKey(userRepository, hashProvider);
    setAdminHashCodeKeyUseCase = new SetAdminHashCodeKeyUseCase(userRepository, hashProvider);
  });

  it('should be able to reset user password by adminHashCode', async () => {
    const authPayload = {
      email: faker.internet.email(),
      password: faker.string.uuid(),
      name: faker.person.firstName(),
    };

    const userResults = await createUser.execute(authPayload);

    if (userResults.isLeft()) throw userResults.value;

    await setAdminHashCodeKeyUseCase.execute({
      hashCodeKey: 'HASH_CODE_KEY',
      userId: userResults.value.user.id,
    });

    jest.spyOn(hashProvider, 'compare').mockImplementation(() => Promise.resolve(true));

    const results = await stu.execute({
      newPassword: 'NEW_PASSWORD',
      adminCodeKey: 'HASH_CODE_KEY',
      email: authPayload.email,
    });

    if (results.isLeft()) throw results.value;

    expect(results.isRight()).toBeTruthy();
    expect(results.value).toHaveProperty('user');
  });

  it('not should be able to reset user password by adminHashCode if user not found', async () => {
    jest
      .spyOn(hashProvider, 'compare')
      .mockClear()
      .mockImplementation(() => Promise.resolve(true));

    const results = await stu.execute({
      newPassword: faker.internet.password(),
      adminCodeKey: 'HASH_CODE_KEY',
      email: faker.internet.email(),
    });

    expect(results.isLeft()).toBeTruthy();
    expect(results.value).toBeInstanceOf(UserNotFound);
  });

  it(' not should be able to reset user password by adminHashCode if adminHashcode is invalid', async () => {
    const authPayload = {
      email: faker.internet.email(),
      password: faker.string.uuid(),
      name: faker.person.firstName(),
    };

    const userResults = await createUser.execute(authPayload);

    if (userResults.isLeft()) throw userResults.value;

    jest
      .spyOn(hashProvider, 'hash')
      .mockClear()
      .mockImplementation(() => Promise.resolve('NEW_PASSOWORD_HASHED'));

    await setAdminHashCodeKeyUseCase.execute({
      hashCodeKey: 'HASH_CODE_KEY',
      userId: userResults.value.user.id,
    });

    jest.spyOn(hashProvider, 'compare').mockImplementation(() => Promise.resolve(false));

    const results = await stu.execute({
      newPassword: 'NEW_PASSWORD',
      adminCodeKey: faker.string.uuid(), // invalid adminCodeKey
      email: authPayload.email,
    });

    expect(results.isLeft()).toBeTruthy();
    expect(results.value).toBeInstanceOf(InvalidCodeKey);
  });

  it('not should be able to reset user password by adminHashCode if not have  admin code key', async () => {
    const authPayload = {
      email: faker.internet.email(),
      password: faker.string.uuid(),
      name: faker.person.firstName(),
    };

    const userResults = await createUser.execute(authPayload);

    if (userResults.isLeft()) throw userResults.value;

    const results = await stu.execute({
      newPassword: 'NEW_PASSWORD',
      adminCodeKey: faker.string.uuid(),
      email: authPayload.email,
    });

    expect(results.isLeft()).toBeTruthy();
    expect(results.value).toBeInstanceOf(InvalidCodeKey);
  });
});
