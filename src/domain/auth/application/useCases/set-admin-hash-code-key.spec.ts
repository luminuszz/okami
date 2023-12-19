import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { HashProvider } from '@domain/auth/application/contracts/hash-provider';
import { SetAdminHashCodeKeyUseCase } from '@domain/auth/application/useCases/set-admin-hash-code-key';
import { fakeHashProvider } from '@test/mocks/mocks';
import { faker } from '@faker-js/faker';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';

describe('SetAdminHashCodeKeyUseCase', () => {
  let createUser: CreateUserUseCase;
  let userRepository: InMemoryUserRepository;
  let hashProvider: HashProvider;
  let stu: SetAdminHashCodeKeyUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    hashProvider = fakeHashProvider;
    createUser = new CreateUserUseCase(hashProvider, userRepository);
    stu = new SetAdminHashCodeKeyUseCase(userRepository, hashProvider);
  });

  it('should be able to reset password with valid user', async () => {
    const authPayload = {
      email: faker.internet.email(),
      password: faker.string.uuid(),
      name: faker.person.firstName(),
    };

    const spy = jest.spyOn(hashProvider, 'hash');

    spy.mockImplementation(() => Promise.resolve(faker.string.uuid()));

    const results = await createUser.execute(authPayload);

    if (results.isRight()) {
      expect(results.isRight()).toBeTruthy();
      const { user } = results.value;
      await stu.execute({ hashCodeKey: 'HASH_CODE_KEY', userId: user.id });

      expect(user.adminHashCodeKey).not.toBeNull();
      expect(user.adminHashCodeKey).not.toBe('HASH_CODE_KEY');
    }
  });

  it(' not should be able to reset password with invalid User', async () => {
    const spy = jest.spyOn(hashProvider, 'hash');

    spy.mockImplementation(() => Promise.resolve(faker.string.uuid()));

    const results = await stu.execute({ hashCodeKey: 'HASH_CODE_KEY', userId: 'FAKE_USER_ID' });

    expect(results.isLeft()).toBeTruthy();
    expect(results.value).toBeInstanceOf(UserNotFound);
  });
});
