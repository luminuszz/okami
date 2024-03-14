import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { createWorkPropsFactory } from '@test/mocks/mocks';
import { WorkRepository } from '../repositories/work-repository';
import { CreateWorkUseCase } from './create-work';
import { InvalidWorkOperationError } from './errors/invalid-work-operation';
import { MarkWorkAsDroppedUseCase } from './mark-work-as-dropped';
import { MarkWorkFinishedUseCase } from './mark-work-finished';

describe('MarkWorkAsDropped', () => {
  let stu: MarkWorkAsDroppedUseCase;
  let createUser: CreateWorkUseCase;
  let workRepository: WorkRepository;
  let markWorkFinished: MarkWorkFinishedUseCase;

  beforeEach(() => {
    workRepository = new InMemoryWorkRepository();

    stu = new MarkWorkAsDroppedUseCase(workRepository);
    createUser = new CreateWorkUseCase(workRepository);
    markWorkFinished = new MarkWorkFinishedUseCase(workRepository);
  });

  it('should mark a work as dropped', async () => {
    const workCreated = await createUser.execute(createWorkPropsFactory());

    if (workCreated.isLeft()) {
      throw workCreated.value;
    }

    const { work } = workCreated.value;
    const result = await stu.execute({ workId: work.id });

    if (result.isLeft()) {
      throw result.value;
    }

    expect(result.isRight()).toBeTruthy();
    expect(result.value.isDropped).toBeTruthy();
  });

  it('not be able to not mark a work as dropped if status is finished', async () => {
    const workToCreate = createWorkPropsFactory();

    const workCreated = await createUser.execute(workToCreate);

    if (workCreated.isLeft()) {
      throw workCreated.value;
    }

    const { work } = workCreated.value;

    await markWorkFinished.execute({ workId: work.id, userId: workToCreate.userId });

    const result = await stu.execute({ workId: work.id });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidWorkOperationError);
  });
});
