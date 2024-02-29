import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Category, Work } from '@domain/work/enterprise/entities/work';
import { faker } from '@faker-js/faker';
import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { FetchAllUserReadWorks } from './fetch-all-user-read-works';

describe('FetchAllUserWorks', () => {
  let stu: FetchAllUserReadWorks;
  let workRepository: InMemoryWorkRepository;

  beforeEach(() => {
    workRepository = new InMemoryWorkRepository();
    stu = new FetchAllUserReadWorks(workRepository);
  });

  it('should be able to find all user works', async () => {
    const fakeUserId = faker.string.uuid();

    const work = Work.create({
      category: Category.MANGA,
      name: 'One Piece',
      userId: fakeUserId,
      chapter: new Chapter(1),
      createdAt: new Date(),
      url: 'http://one-piece.com',
      hasNewChapter: false,
    });

    await workRepository.create(work);

    const response = await stu.execute({ userId: fakeUserId });

    if (response.isLeft()) throw response.value;

    expect(response.isRight());

    expect(response.value.works).toHaveLength(1);
  });

  it('should be able to return empty array if not found works', async () => {
    const fakeUserId = faker.string.uuid();

    const work = Work.create({
      category: Category.MANGA,
      name: 'One Piece',
      userId: fakeUserId,
      chapter: new Chapter(1),
      createdAt: new Date(),
      url: 'http://one-piece.com',
      hasNewChapter: false,
    });

    await workRepository.create(work);

    const response = await stu.execute({ userId: '1' });

    if (response.isLeft()) throw response.value;

    expect(response.isRight());

    expect(response.value.works).toHaveLength(0);
  });

  it('should only by return works with hasNewChapter status false', async () => {
    const fakeUserId = faker.string.uuid();

    const work = Work.create({
      category: Category.MANGA,
      name: 'One Piece',
      userId: fakeUserId,
      chapter: new Chapter(1),
      createdAt: new Date(),
      url: 'http://one-piece.com',
      hasNewChapter: faker.helpers.arrayElement([true, false]),
    });

    for (let i = 0; i < 10; i++) {
      await workRepository.create(work);
    }

    await workRepository.create(work);

    const response = await stu.execute({ userId: fakeUserId });

    if (response.isLeft()) throw response.value;

    const rightWorksLength = workRepository.works.filter(
      (work) => work.hasNewChapter === false && work.userId === fakeUserId,
    ).length;

    expect(response.isRight());
    expect(response.value.works).toHaveLength(rightWorksLength);
  });
});
