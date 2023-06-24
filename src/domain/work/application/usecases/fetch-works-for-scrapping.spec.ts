import { describe, expect } from 'vitest';
import { InMemoryWorkRepository } from '../../../../../test/mocks/in-mermory-work-repository';
import { FetchWorksForScrappingUseCase } from '@domain/work/application/usecases/fetch-works-for-scrapping';
import { CreateWorkUseCase } from '@domain/work/application/usecases/create-work';
import { Category } from '@domain/work/enterprise/entities/work';
import { faker } from '@faker-js/faker';

describe('FetchWorksForScrapping', () => {
  let stu: FetchWorksForScrappingUseCase;

  let workRepository: InMemoryWorkRepository;

  beforeEach(() => {
    workRepository = new InMemoryWorkRepository();
    stu = new FetchWorksForScrappingUseCase(workRepository);
  });

  it('should fetch works for scrapping', async () => {
    const createWork = new CreateWorkUseCase(workRepository);

    Array.from({ length: 5 }).map(async () => {
      await createWork.execute({
        category: Category.ANIME,
        name: faker.person.fullName(),
        chapter: faker.number.int({ max: 100 }),
        url: faker.internet.url(),
      });
    });

    const { work: workWithMarkFinished } = await createWork.execute({
      category: Category.ANIME,
      name: faker.person.fullName(),
      chapter: faker.number.int({ max: 100 }),
      url: faker.internet.url(),
    });

    workWithMarkFinished.markAsFinished();

    await workRepository.save(workWithMarkFinished);

    const { work: workWithMarkHasNewChapterTrue } = await createWork.execute({
      category: Category.ANIME,
      name: faker.person.fullName(),
      chapter: faker.number.int({ max: 100 }),
      url: faker.internet.url(),
    });

    workWithMarkHasNewChapterTrue.markAsFinished();

    await workRepository.save(workWithMarkHasNewChapterTrue);

    const results = await stu.execute();

    expect(results.isRight()).toBeTruthy();

    if (results.isRight()) {
      expect(results.value.works.length).toBe(5);
    }
  });
});
