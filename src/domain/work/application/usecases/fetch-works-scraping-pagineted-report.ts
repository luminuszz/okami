import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { RefreshStatus } from '@prisma/client';
import { WorkRepository } from '../repositories/work-repository';

interface Props {
  page: number;
  filter?: RefreshStatus;
  userId: string;
  search?: string;
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

  async execute({ page, filter, userId, search }: Props): Promise<Response> {
    const { data, totalOfPages } = await this.workRepository.fetchWorksScrapingPaginated(userId, page, filter, search);

    return right({
      data,
      totalOfPages,
    });
  }
}
