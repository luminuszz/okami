import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { ToggleWorkFavorite } from '@domain/work/application/usecases/toggle-work-favorite';
import { createWorkPropsFactory } from '@test/mocks/mocks';
import { Work } from '@domain/work/enterprise/entities/work';

describe('ToggleWorkFavorite', () => {
  let workRepository: InMemoryWorkRepository;
  let stu: ToggleWorkFavorite;

  beforeEach(() => {
    workRepository = new InMemoryWorkRepository();
    stu = new ToggleWorkFavorite(workRepository);
  });

  it('should be able to mark work as favorite', async () => {
    const work = Work.create(createWorkPropsFactory());

    await workRepository.create(work);

    await stu.execute({ workId: work.id });

    const workFromRepository = await workRepository.findById(work.id);

    expect(workFromRepository.isFavorite).toBe(true);
  });

  it('should be able to unmark work as favorite', async () => {
    const work = Work.create(createWorkPropsFactory({ isFavorite: true }));

    await workRepository.create(work);

    await stu.execute({ workId: work.id });

    const workFromRepository = await workRepository.findById(work.id);

    expect(workFromRepository.isFavorite).toBe(false);
  });
});
