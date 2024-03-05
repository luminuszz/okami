import { User } from '@domain/auth/enterprise/entities/User';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { createUserPropsFactory } from '@test/mocks/mocks';
import { UpdateUser } from './update-user';
import { faker } from '@faker-js/faker';
import { UserNotFound } from '../errors/UserNotFound';

describe('UpdateUser', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let stu: UpdateUser;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    stu = new UpdateUser(inMemoryUserRepository);
  });

  it('should be able to update a user', async () => {
    const user = User.create(createUserPropsFactory());

    await inMemoryUserRepository.create(user);

    const results = await stu.execute({
      userId: user.id,
      email: 'cavalo_de_trol@gmail.com',
      name: 'Petter parkson',
    });

    expect(results.isRight()).toBe(true);

    if (results.isRight()) {
      expect(results.value.user.email).toBe('cavalo_de_trol@gmail.com');
      expect(results.value.user.name).toBe('Petter parkson');
    }
  });

  it('should  notbe able to update a user if not exists', async () => {
    const user = User.create(createUserPropsFactory());

    await inMemoryUserRepository.create(user);

    const fakeUserId = faker.string.uuid();

    const results = await stu.execute({
      userId: fakeUserId,
      email: 'cavalo_de_trol@gmail.com',
      name: 'Petter parkson',
    });

    expect(results.isLeft()).toBe(true);

    expect(results.value).toBeInstanceOf(UserNotFound);
  });
});
