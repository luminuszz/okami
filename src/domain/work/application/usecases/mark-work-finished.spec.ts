import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { MarkWorkFinishedUseCase } from '@domain/work/application/usecases/mark-work-finished';
import { CreateWorkUseCase } from '@domain/work/application/usecases/create-work';
import { Category } from '@domain/work/enterprise/entities/work';
import { WorkNotFoundError } from '@domain/work/application/usecases/errors/work-not-found';
import { WorkMarkedFinishedEvent } from '@domain/work/enterprise/entities/events/work-marked-finished-event';
import { faker } from '@faker-js/faker';

describe('MarkWorkFinished', () => {
  let stu: MarkWorkFinishedUseCase;
  let workRepository: InMemoryWorkRepository;
  let createWorkUseCase: CreateWorkUseCase;

  beforeEach(() => {
    workRepository = new InMemoryWorkRepository();
    stu = new MarkWorkFinishedUseCase(workRepository);
    createWorkUseCase = new CreateWorkUseCase(workRepository);
  });

  it('should be able to mark work as finished', async () => {
    const userId = faker.string.uuid();

    const response = await createWorkUseCase.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
      userId: userId,
    });

    if (response.isLeft()) throw response.value;

    const result = await stu.execute({ workId: response.value.work.id, userId });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toHaveProperty('work');

    if (result.isRight()) {
      expect(result.value?.work.isFinished).toBeTruthy();
    }
  });

  it('should not be able to mark work as finished if work not exists', async () => {
    const createWork = new CreateWorkUseCase(workRepository);

    await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'kimi no na wa',
      url: 'https://kiminonawa.com',
      userId: faker.string.uuid(),
    });

    const result = await stu.execute({ workId: 'INVALID_ID', userId: 'INVALIDUSER' });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WorkNotFoundError);
  });

  it('should be able to MarkWorkFinishedEvent has been dispatched', async () => {
    const userId = faker.string.uuid();

    const response = await createWorkUseCase.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
      userId,
    });

    if (response.isLeft()) throw response.value;

    const result = await stu.execute({ workId: response.value.work.id, userId });

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.work.events[0]).toBeInstanceOf(WorkMarkedFinishedEvent);
    }
  });
});
