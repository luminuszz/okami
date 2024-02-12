import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { CreateWorkUseCase } from './create-work';
import { FetchWorksScrapingPaginatedReportUseCase } from './fetch-works-scraping-pagineted-report';
import { createWorkPropsFactory } from '@test/mocks/mocks';

describe('FetchWorksScrapingPaginatedReportUseCase', () => {
  let stu: FetchWorksScrapingPaginatedReportUseCase;
  let createWork: CreateWorkUseCase;
  let workRepository: InMemoryWorkRepository;

  beforeEach(() => {
    workRepository = new InMemoryWorkRepository();
    stu = new FetchWorksScrapingPaginatedReportUseCase(workRepository);
    createWork = new CreateWorkUseCase(workRepository);
  });

  it('should be able to get a paginated list of works for scrapping report', async () => {
    for (let i = 0; i < 50; i++) {
      const data = createWorkPropsFactory();

      if (i === 1) {
        data.name = 'Naruto';
      }

      await createWork.execute(data);
    }

    const result = await stu.execute({ page: 2 });

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.data.length).toBe(10);
      expect(result.value.totalOfPages).toBe(5);

      expect(result.value.data.every((work) => work.name !== 'Naruto')).toBeTruthy();
    }
  });
});
