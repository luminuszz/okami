import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { CreateWorkUseCase } from '@domain/work/application/usecases/create-work';
import { UpdateRefreshStatusUseCase } from '@domain/work/application/usecases/update-refresh-status';
import { Category, RefreshStatus } from '@domain/work/enterprise/entities/work';
import { WorkRefreshStatusUpdatedEvent } from '@domain/work/enterprise/entities/events/work-refresh-status-updated';

describe('UpdateRefreshStatusUseCase', () => {
  let stu: UpdateRefreshStatusUseCase;
  let workRepository: InMemoryWorkRepository;
  let createWork: CreateWorkUseCase;

  beforeEach(() => {
    workRepository = new InMemoryWorkRepository();
    stu = new UpdateRefreshStatusUseCase(workRepository);
    createWork = new CreateWorkUseCase(workRepository);
  });

  it("should be able to update work's refresh status to SUCCESS", async () => {
    const workResults = await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
      userId: 'user-id',
    });

    if (workResults.isLeft()) throw workResults.value;

    const { id: workId } = workResults.value.work;

    const results = await stu.execute({ workId, refreshStatus: RefreshStatus.SUCCESS });

    expect(results.isRight()).toBe(true);

    if (results.isRight()) {
      console.log({
        results: results.value.refreshStatus,
      });

      expect(results.value.refreshStatus).toBe(RefreshStatus.SUCCESS);
      expect(results.value.events.some((event) => event instanceof WorkRefreshStatusUpdatedEvent)).toBeTruthy();
    }
  });

  it("should be able to update work's refresh status to FALIED", async () => {
    const workResults = await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
      userId: 'user-id',
    });

    if (workResults.isLeft()) throw workResults.value;

    const { id: workId } = workResults.value.work;

    const results = await stu.execute({ workId, refreshStatus: RefreshStatus.FAILED });

    expect(results.isRight()).toBe(true);

    if (results.isRight()) {
      expect(results.value.refreshStatus).toBe(RefreshStatus.FAILED);
      expect(results.value.events.some((event) => event instanceof WorkRefreshStatusUpdatedEvent)).toBeTruthy();
    }
  });
});
