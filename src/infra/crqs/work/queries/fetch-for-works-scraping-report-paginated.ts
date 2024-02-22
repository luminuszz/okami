import { FetchWorksScrapingPaginatedReportUseCase } from '@domain/work/application/usecases/fetch-works-scraping-pagineted-report';
import { RefreshStatus } from '@domain/work/enterprise/entities/work';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FetchWorksScrapingPaginatedReportQuery {
  constructor(
    public readonly page: number,
    public readonly filter?: RefreshStatus,
  ) {}
}

@QueryHandler(FetchWorksScrapingPaginatedReportQuery)
export class FetchWorksScrapingPaginatedReportQueryHandler
  implements IQueryHandler<FetchWorksScrapingPaginatedReportQuery>
{
  constructor(private readonly fetchWorksScrapingPaginatedRepor: FetchWorksScrapingPaginatedReportUseCase) {}

  async execute({ page, filter }: FetchWorksScrapingPaginatedReportQuery) {
    const result = await this.fetchWorksScrapingPaginatedRepor.execute({ page, filter });

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
