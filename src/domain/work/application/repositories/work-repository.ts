import { Work } from '@domain/work/enterprise/entities/work';
import { RefreshStatus } from '@prisma/client';

export abstract class WorkRepository {
  abstract create(work: Work): Promise<void>;
  abstract save(work: Work): Promise<void>;
  abstract findById(id: string): Promise<Work>;
  abstract fetchForWorkersWithHasNewChapterFalse(): Promise<Work[]>;
  abstract fetchForWorkersWithHasNewChapterTrue(): Promise<Work[]>;
  abstract fetchForWorksWithHasNewChapterFalseAndWithIsFinishedFalse(): Promise<Work[]>;
  abstract findOne(id: string): Promise<Work>;
  abstract saveMany(works: Work[]): Promise<void>;
  abstract fetchWorksScrapingPaginated(
    page: number,
    filter?: RefreshStatus,
  ): Promise<{ data: Work[]; totalOfPages: number }>;
}
