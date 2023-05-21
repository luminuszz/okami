import { Work } from '@domain/work/enterprise/entities/work';

export interface WorkHttp {
  id: string;
  name: string;
  url: string;
  hasNewChapter: boolean;
}

export class WorkModel {
  static toHttp(work: Work): WorkHttp {
    return {
      hasNewChapter: work.hasNewChapter,
      id: work.id,
      name: work.name,
      url: work.url,
    };
  }
}
