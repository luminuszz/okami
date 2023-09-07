import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { faker } from '@faker-js/faker';
import { HashProvider } from '@domain/auth/application/contracts/hash-provider';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { UserAlreadyExists } from '@domain/auth/application/errors/UserAlreadyExists';
import { Test } from '@nestjs/testing';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';

const fakeHashProvider: HashProvider = {
  hash: jest.fn(),
  compare: jest.fn(),
};

describe('Create User', () => {
  let stu: CreateUserUseCase;
  let hashProvider: HashProvider;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: HashProvider,
          useValue: fakeHashProvider,
        },
        {
          provide: UserRepository,
          useClass: InMemoryUserRepository,
        },
      ],
    }).compile();

    stu = moduleRef.get<CreateUserUseCase>(CreateUserUseCase);
    hashProvider = moduleRef.get<HashProvider>(HashProvider);
  });

  it('should create a user', async () => {
    const hashMethod = jest.spyOn(hashProvider, 'hash');
    hashMethod.mockImplementation(() => Promise.resolve(faker.string.uuid()));

    const payload = {
      password: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.firstName(),
    };

    const results = await stu.execute(payload);

    expect(results.value).toBeDefined();
    expect(results.value).toHaveProperty('user');
    expect(hashMethod).toHaveBeenCalled();

    if (results.isRight()) {
      expect(results.value.user.passwordHash).not.toBe(payload.password);
    }
  });

  it('should not be able to create a User with already used email', async () => {
    const payload = {
      password: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.firstName(),
    };

    await stu.execute(payload);

    const results = await stu.execute(payload);

    expect(results.isLeft()).toBe(true);
    expect(results.value).toBeInstanceOf(UserAlreadyExists);
  });
});
