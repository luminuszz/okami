import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { Work } from '@domain/work/enterprise/entities/work';
import { UseCaseImplementation } from '@core/use-case';
import { Either, right } from '@core/either';
import { RefreshStatus } from '@prisma/client';

interface Props {
  page: number;
  filter?: RefreshStatus;
  userId: string;
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

  async execute({ page, filter, userId }: Props): Promise<Response> {
    const { data, totalOfPages } = await this.workRepository.fetchWorksScrapingPaginated(userId, page, filter);

    return right({
      data,
      totalOfPages,
    });
  }
}
