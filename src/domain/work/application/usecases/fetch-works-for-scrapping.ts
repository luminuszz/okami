import { UseCaseImplementation } from '@core/use-case';
import { Either, right } from '@core/either';
import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '@domain/work/application/repositories/work-repository';

interface FetchWorksForScrappingInput {
  userId: string;
}

type FetchWorksForScrappingOutput = Either<null, { works: Work[] }>;

@Injectable()
export class FetchWorksForScrappingUseCase
  implements UseCaseImplementation<FetchWorksForScrappingInput, FetchWorksForScrappingOutput>
{
  constructor(private readonly workRepository: WorkRepository) {}

  async execute({ userId }: FetchWorksForScrappingInput): Promise<FetchWorksForScrappingOutput> {
    const works = await this.workRepository.fetchForWorksWithHasNewChapterFalseAndWithIsFinishedFalse(userId);

    return right({
      works,
    });
  }
}
