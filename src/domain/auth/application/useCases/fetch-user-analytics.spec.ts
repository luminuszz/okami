import { User } from '@domain/auth/enterprise/entities/User';
import { faker } from '@faker-js/faker';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { FetchUserAnalytics } from './fetch-user-analytics';

describe('FetchUserAnalytics', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let stu: FetchUserAnalytics;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    stu = new FetchUserAnalytics(inMemoryUserRepository);
  });

  it('should be able to get user analytics', async () => {
    const user = User.create({
      name: faker.person.firstName(),
      passwordHash: faker.internet.password(),
      email: faker.internet.email(),
    });

    await inMemoryUserRepository.create(user);

    const results = await stu.execute({ userId: user.id.toString() });

    expect(results.isRight()).toBe(true);
  });
});
