import { FetchForWorkersUnreadUseCase } from '@domain/work/application/usecases/fetch-for-workrers-unread';
import { Test } from '@nestjs/testing';
import { WorkRepository } from '@domain/work/application/repositories/work-repository';
import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { Category, Work } from '@domain/work/enterprise/entities/work';
import { faker } from '@faker-js/faker';
import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';

describe('FetchForWorksUnread', () => {
  let stu: FetchForWorkersUnreadUseCase;
  let workRepository: WorkRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [FetchForWorkersUnreadUseCase, { provide: WorkRepository, useClass: InMemoryWorkRepository }],
    }).compile();

    stu = moduleRef.get<FetchForWorkersUnreadUseCase>(FetchForWorkersUnreadUseCase);
    workRepository = moduleRef.get<WorkRepository>(WorkRepository);
  });

  it('should be able o get all works unread', async () => {
    const randomNumber = faker.number.int({ min: 1, max: 10 });

    for (let i = 0; i < randomNumber; i++) {
      await workRepository.create(
        Work.create({
          createdAt: new Date(),
          hasNewChapter: true,
          category: Category.MANGA,
          chapter: new Chapter(1),
          name: 'One Piece',
          url: 'https://onepiece.com',
        }),
      );
    }

    const results = await stu.execute();

    console.log({
      results,
    });

    expect(results.isRight()).toBeTruthy();

    if (results.isRight()) {
      expect(results.value.works.length).toEqual(randomNumber);
      const condition = results.value.works.every((work) => work.hasNewChapter);

      expect(condition).toBeTruthy();
    }
  });
});
