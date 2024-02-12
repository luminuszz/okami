import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { Work } from '@domain/work/enterprise/entities/work';
import { UseCaseImplementation } from '@core/use-case';
import { Either, right } from '@core/either';

interface Props {
  page: number;
}

type Response = Either<
  void,
  {
    data: Work[];
    totalOfPages: number;
  }
>;

@Injectable()
export class FetchWorksScrapingPaginatedReportUseCase implements UseCaseImplementation<Props, Response> {
  constructor(private readonly workRepository: WorkRepository) {}

  async execute({ page }: Props): Promise<Response> {
    const { data, totalOfPages } = await this.workRepository.fetchWorksScrapingPaginated(page);

    return right({
      data,
      totalOfPages,
    });
  }
}
