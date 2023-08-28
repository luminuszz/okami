import { beforeEach, describe, expect } from 'vitest';
import { SubscribeToWorkUseCase } from '@domain/work/application/usecases/subscribe-to-work';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { fakeHashProvider } from '@test/mocks/mocks';
import { faker } from '@faker-js/faker';
import { CreateWorkUseCase } from '@domain/work/application/usecases/create-work';
import { Category } from '@domain/work/enterprise/entities/work';
import { WorkNotFoundError } from '@domain/work/application/usecases/errors/work-not-found';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';

describe('SubscribeToWork', () => {
  let stu: SubscribeToWorkUseCase;
  let userRepository: InMemoryUserRepository;
  let workRepository: InMemoryWorkRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    workRepository = new InMemoryWorkRepository();
    stu = new SubscribeToWorkUseCase(workRepository, userRepository);
  });

  it('should be able to subscribe to a work', async () => {
    const createUser = new CreateUserUseCase(fakeHashProvider, userRepository);
    const createWork = new CreateWorkUseCase(workRepository);

    const results = await createUser.execute({
      name: faker.person.firstName(),
      password: faker.string.uuid(),
      email: faker.internet.email(),
    });

    const workResults = await createWork.execute({
      name: faker.lorem.words(3),
      url: faker.internet.url(),
      chapter: faker.number.int(),
      category: Category.MANGA,
    });

    if (results.isLeft()) throw results.value;

    await stu.execute({ workId: workResults.work.id, subscriberId: results.value.user.id });

    expect(workRepository.works[0].subscribers[0].id).toBe(results.value.user.id);
  });

  it('should not be able to subscribe to a work if work not found', async () => {
    const createUser = new CreateUserUseCase(fakeHashProvider, userRepository);
    const createWork = new CreateWorkUseCase(workRepository);

    const results = await createUser.execute({
      name: faker.person.firstName(),
      password: faker.string.uuid(),
      email: faker.internet.email(),
    });

    await createWork.execute({
      name: faker.lorem.words(3),
      url: faker.internet.url(),
      chapter: faker.number.int(),
      category: Category.MANGA,
    });

    if (results.isLeft()) throw results.value;

    const response = await stu.execute({ workId: 'FAKE_ID', subscriberId: results.value.user.id });

    expect(response.isLeft()).toBe(true);

    expect(response.value).toBeInstanceOf(WorkNotFoundError);
  });

  it('should not be able to subscribe to a work if subscriber not found', async () => {
    const createUser = new CreateUserUseCase(fakeHashProvider, userRepository);
    const createWork = new CreateWorkUseCase(workRepository);

    await createUser.execute({
      name: faker.person.firstName(),
      password: faker.string.uuid(),
      email: faker.internet.email(),
    });

    const workResults = await createWork.execute({
      name: faker.lorem.words(3),
      url: faker.internet.url(),
      chapter: faker.number.int(),
      category: Category.MANGA,
    });

    const response = await stu.execute({ workId: workResults.work.id, subscriberId: 'FAKE_ID' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(UserNotFound);
  });
});
