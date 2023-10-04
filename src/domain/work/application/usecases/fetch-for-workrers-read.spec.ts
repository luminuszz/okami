import { Test } from '@nestjs/testing';
import { WorkRepository } from '@domain/work/application/repositories/work-repository';
import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { Category, Work } from '@domain/work/enterprise/entities/work';
import { faker } from '@faker-js/faker';
import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { FetchForWorkersReadUseCase } from '@domain/work/application/usecases/fetch-for-workrers-read';

describe('FetchForWorksRead', () => {
  let stu: FetchForWorkersReadUseCase;
  let workRepository: WorkRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [FetchForWorkersReadUseCase, { provide: WorkRepository, useClass: InMemoryWorkRepository }],
    }).compile();

    stu = moduleRef.get<FetchForWorkersReadUseCase>(FetchForWorkersReadUseCase);
    workRepository = moduleRef.get<WorkRepository>(WorkRepository);
  });

  it('should be able o get all works read', async () => {
    const randomNumber = faker.number.int({ min: 1, max: 10 });

    const fakeUserId = faker.string.uuid();

    for (let i = 0; i < randomNumber; i++) {
      await workRepository.create(
        Work.create({
          createdAt: new Date(),
          hasNewChapter: false,
          category: Category.MANGA,
          chapter: new Chapter(1),
          name: 'One Piece',
          url: 'https://onepiece.com',
          userId: fakeUserId,
        }),
      );
    }

    const results = await stu.execute({ userId: fakeUserId });

    expect(results.isRight()).toBeTruthy();

    if (results.isRight()) {
      expect(results.value.works.length).toEqual(randomNumber);
      const condition = results.value.works.every((work) => !work.hasNewChapter);

      expect(condition).toBeTruthy();
    }
  });
});
