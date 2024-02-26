import { Work } from '@domain/work/enterprise/entities/work';
import { RefreshStatus } from '@prisma/client';

export interface FetchUserWorksInput {
  status?: 'unread' | 'read' | 'finished' | 'dropped';
  userId: string;
}

export abstract class WorkRepository {
  abstract create(work: Work): Promise<void>;
  abstract save(work: Work): Promise<void>;
  abstract findById(id: string): Promise<Work>;
  abstract fetchForWorkersWithHasNewChapterFalse(): Promise<Work[]>;
  abstract fetchForWorkersWithHasNewChapterTrue(): Promise<Work[]>;
  abstract fetchForWorksWithHasNewChapterFalseAndWithIsFinishedFalseAndIsDroppedFalse(): Promise<Work[]>;
  abstract findOne(id: string): Promise<Work>;
  abstract saveMany(works: Work[]): Promise<void>;
  abstract fetchWorksScrapingPaginated(
    userId: string,
    page: number,
    filter?: RefreshStatus,
  ): Promise<{ data: Work[]; totalOfPages: number }>;

  abstract fetchWorksByUserIdWithFilters(payload: FetchUserWorksInput): Promise<Work[]>;
}
