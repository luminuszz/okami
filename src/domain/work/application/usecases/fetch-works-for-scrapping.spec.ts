import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
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
    const fakeUserId = faker.string.uuid();

    Array.from({ length: 5 }).map(async () => {
      await createWork.execute({
        category: Category.ANIME,
        name: faker.person.fullName(),
        chapter: faker.number.int({ max: 100 }),
        url: faker.internet.url(),
        userId: fakeUserId,
      });
    });

    const results = await createWork.execute({
      category: Category.ANIME,
      name: faker.person.fullName(),
      chapter: faker.number.int({ max: 100 }),
      url: faker.internet.url(),
      userId: fakeUserId,
    });

    if (results.isLeft()) throw results.value;

    results.value.work.markAsFinished();

    await workRepository.save(results.value.work);

    const createWorkResponse = await createWork.execute({
      category: Category.ANIME,
      name: faker.person.fullName(),
      chapter: faker.number.int({ max: 100 }),
      url: faker.internet.url(),
      userId: fakeUserId,
    });

    if (createWorkResponse.isLeft()) throw createWorkResponse.value;

    const { work: workWithMarkHasNewChapterTrue } = createWorkResponse.value;

    workWithMarkHasNewChapterTrue.markAsFinished();

    await workRepository.save(workWithMarkHasNewChapterTrue);

    const stuResults = await stu.execute({ userId: fakeUserId });

    expect(results.isRight()).toBeTruthy();

    if (stuResults.isRight()) {
      expect(stuResults.value.works.length).toBe(5);
    }
  });
});
