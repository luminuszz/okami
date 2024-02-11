import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { MarkWorksOnPendingStatusUseCase } from './mark-works-on-pending-status';
import { createWorkPropsFactory } from '@test/mocks/mocks';
import { CreateWorkUseCase } from './create-work';

describe('MarkWorksOnPendingStatusUseCase', () => {
  let stu: MarkWorksOnPendingStatusUseCase;
  let workRepository: InMemoryWorkRepository;
  let createWork: CreateWorkUseCase;

  beforeEach(() => {
    workRepository = new InMemoryWorkRepository();
    stu = new MarkWorksOnPendingStatusUseCase(workRepository);
    createWork = new CreateWorkUseCase(workRepository);
  });

  it('should mark works as pending', async () => {
    for (let i = 0; i < 10; i++) {
      const work = createWorkPropsFactory();
      work.hasNewChapter = false;

      await createWork.execute(work);
    }

    const works = await workRepository.fetchForWorkersWithHasNewChapterFalse();

    await stu.execute({ works });

    expect(workRepository.works.every((work) => work.refreshStatus === 'PENDING')).toBe(true);
  });
});
