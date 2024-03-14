import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Category, Work, WorkStatus } from '@domain/work/enterprise/entities/work';
import { faker } from '@faker-js/faker';
import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { DeleteWork } from './delete-work';
import { WorkNotFoundError } from './errors/work-not-found';

describe('DeleteWork', () => {
  let stu: DeleteWork;
  let workRepository: InMemoryWorkRepository;

  beforeEach(() => {
    workRepository = new InMemoryWorkRepository();
    stu = new DeleteWork(workRepository);
  });

  it('should be able to delete a work', async () => {
    const work = Work.create({
      category: Category.MANGA,
      name: 'One Piece',
      userId: '1',
      chapter: new Chapter(1),
      createdAt: new Date(),
      url: 'http://one-piece.com',
      status: WorkStatus.READ,
    });

    await workRepository.create(work);

    const response = await stu.execute({ workId: work.id, userId: '1' });

    expect(response.isRight());
    expect(workRepository.works).toHaveLength(0);
  });

  it('should not be able to delete a work if work not exists', async () => {
    const fakeWorkId = faker.string.uuid();

    const work = Work.create({
      category: Category.MANGA,
      name: 'One Piece',
      userId: faker.string.uuid(),
      chapter: new Chapter(1),
      createdAt: new Date(),
      url: 'http://one-piece.com',
      status: WorkStatus.READ,
    });

    await workRepository.create(work);

    const response = await stu.execute({ workId: fakeWorkId, userId: '1' });

    expect(workRepository.works).toHaveLength(1);
    expect(response.isLeft());
    expect(response.value).toBeInstanceOf(WorkNotFoundError);
  });
});
