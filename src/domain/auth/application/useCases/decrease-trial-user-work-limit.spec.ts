import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { faker } from '@faker-js/faker';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { fakeHashProvider } from '@test/mocks/mocks';
import { DecreaseTrialUserWorkLimit } from './decrease-trial-user-work-limit';

describe('DecreaseTrialUserWorkLimit', () => {
  let createUser: CreateUserUseCase;
  let userRepository: InMemoryUserRepository;
  let stu: DecreaseTrialUserWorkLimit;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    createUser = new CreateUserUseCase(fakeHashProvider, userRepository);

    stu = new DecreaseTrialUserWorkLimit(userRepository);
  });

  it('should be able to decrease user work trial limit quote', async () => {
    const results = await createUser.execute({
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
    });

    if (results.isLeft()) throw results.value;

    const { user } = results.value;

    await stu.execute({ userId: user.id });

    expect(userRepository.users[0].trialWorkLimit).toBe(4);
  });

  it('should not be able to decrease user work trial limit quote if quote is 0', async () => {
    const results = await createUser.execute({
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
    });

    if (results.isLeft()) throw results.value;

    const { user } = results.value;

    for (let i = 0; i < 10; i++) {
      await stu.execute({ userId: user.id });
    }

    expect(userRepository.users[0].trialWorkLimit).toBe(0);
  });
});
