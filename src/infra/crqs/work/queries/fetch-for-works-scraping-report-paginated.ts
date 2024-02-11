import { FetchWorksScrapingPaginatedReportUseCase } from '@domain/work/application/usecases/fetch-works-scraping-pagineted-report';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FetchWorksScrapingPaginatedReportQuery {
  constructor(public readonly page: number) {}
}

@QueryHandler(FetchWorksScrapingPaginatedReportQuery)
export class FetchWorksScrapingPaginatedReportQueryHandler
  implements IQueryHandler<FetchWorksScrapingPaginatedReportQuery>
{
  constructor(private readonly fetchWorksScrapingPaginatedRepor: FetchWorksScrapingPaginatedReportUseCase) {}

  async execute({ page }: FetchWorksScrapingPaginatedReportQuery) {
    const result = await this.fetchWorksScrapingPaginatedRepor.execute({ page });

    if (result.isLeft()) {
      throw result.value;
    }

    const { data, totalOfPages } = result.value;

    return {
      data,
      totalOfPages,
    };
  }
}
