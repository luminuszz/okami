import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { DeleteWork } from './delete-work';
import { Category, Work } from '@domain/work/enterprise/entities/work';
import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { faker } from '@faker-js/faker';
import { WorkNotFoundError } from './errors/work-not-found';

describe('DeleteWork', () => {
  let stu: DeleteWork;
  let workRepository: InMemoryWorkRepository;

  beforeEach(() => {
    workRepository = new InMemoryWorkRepository();
    stu = new DeleteWork(workRepository);
  });

  it('shoud be able to delete a work', async () => {
    const work = Work.create({
      category: Category.MANGA,
      name: 'One Piece',
      userId: '1',
      chapter: new Chapter(1),
      createdAt: new Date(),
      url: 'http://one-piece.com',
      hasNewChapter: false,
    });

    await workRepository.create(work);

    const response = await stu.execute({ workId: work.id });

    expect(response.isRight());
    expect(workRepository.works).toHaveLength(0);
  });

  it('shoud be able to delete a work', async () => {
    const fakeWorkId = faker.string.uuid();

    const response = await stu.execute({ workId: fakeWorkId });

    expect(workRepository.works).toHaveLength(0);
    expect(response.isLeft());
    expect(response.value).toBeInstanceOf(WorkNotFoundError);
  });
});
