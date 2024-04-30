import { Tag } from '@domain/work/enterprise/entities/tag';

export abstract class TagRepository {
  abstract create(tag: Tag): Promise<void>;
  abstract save(tag: Tag): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findBySlug(slug: string): Promise<Tag | null>;
  abstract findById(id: string): Promise<Tag | null>;
}
