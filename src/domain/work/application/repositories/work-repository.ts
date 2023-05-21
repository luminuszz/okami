import { Work } from '@domain/work/enterprise/entities/work';

export abstract class WorkRepository {
  abstract create(work: Work): Promise<void>;
  abstract save(work: Work): Promise<void>;
  abstract findById(id: string): Promise<Work>;
}
