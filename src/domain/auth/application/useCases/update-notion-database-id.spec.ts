import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { UpdateNotionDatabaseId } from './update-notion-database-id';
import { CreateUserUseCase } from './create-user';
import { fakeHashProvider } from '@test/mocks/mocks';
import { faker } from '@faker-js/faker';
import { UserNotFound } from '../errors/UserNotFound';

describe('Update Notion Database Id', () => {
  let useRepository: InMemoryUserRepository;
  let stu: UpdateNotionDatabaseId;
  let createUser: CreateUserUseCase;

  beforeEach(() => {
    useRepository = new InMemoryUserRepository();
    stu = new UpdateNotionDatabaseId(useRepository);
    createUser = new CreateUserUseCase(fakeHashProvider, useRepository);
  });

  it('should be be to set notion database id', async () => {
    const results = await createUser.execute({
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
    });

    if (results.isLeft()) {
      throw results.value;
    }

    const { user } = results.value;

    const fakeNotionId = faker.string.uuid();

    const response = await stu.execute({
      userId: user.id,
      notionDatabaseId: fakeNotionId,
    });

    expect(response.isRight()).toBe(true);

    if (response.isRight()) {
      expect(response.value.user.notionDatabaseId).not.toBe('');
      expect(response.value.user.notionDatabaseId).toBe(fakeNotionId);
      expect(response.value.user.createdAt).not.toBe(response.value.user.updatedAt);
    }
  });

  it('should not be  able set notion database id if user not found', async () => {
    const fakeNotionId = faker.string.uuid();

    const fakeUserId = faker.string.uuid();

    const response = await stu.execute({
      userId: fakeUserId,
      notionDatabaseId: fakeNotionId,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(UserNotFound);
  });
});
