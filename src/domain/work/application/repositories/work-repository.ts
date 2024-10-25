import { Work } from '@domain/work/enterprise/entities/work';
import { RefreshStatus } from '@prisma/client';

export interface FetchUserWorksInput {
  status?: 'unread' | 'read' | 'finished' | 'dropped' | 'favorites';
  search?: string;
  userId: string;
}

export abstract class WorkRepository {
  abstract create(work: Work): Promise<void>;
  abstract save(work: Work): Promise<void>;
  abstract findById(id: string): Promise<Work>;
  abstract fetchForWorkersWithHasNewChapterFalse(): Promise<Work[]>;
  abstract fetchForWorkersWithHasNewChapterTrue(): Promise<Work[]>;
  abstract findOne(id: string): Promise<Work>;
  abstract saveMany(works: Work[]): Promise<void>;
  abstract fetchWorksScrapingPaginated(
    userId: string,
    page: number,
    filter?: RefreshStatus,
    search?: string,
  ): Promise<{ data: Work[]; totalOfPages: number }>;

  abstract fetchForWorksForScrapping(): Promise<Work[]>;

  abstract fetchWorksByUserIdWithFilters(payload: FetchUserWorksInput): Promise<Work[]>;

  abstract fetchAllWorksByUserIdCount(userId: string): Promise<number>;

  abstract deleteWork(workId: string): Promise<void>;

  abstract fetchAllWorksByUserIdAndHasNewChapterFalse(userId: string): Promise<Work[]>;

  abstract findUserWorkById(userId: string, workId: string): Promise<Work | null>;
}
