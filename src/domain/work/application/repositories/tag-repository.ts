import { Tag } from '@domain/work/enterprise/entities/tag';

export abstract class TagRepository {
  abstract create(tag: Tag): Promise<void>;
  abstract save(tag: Tag): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findBySlug(slug: string): Promise<Tag | null>;
  abstract findById(id: string): Promise<Tag | null>;
  abstract linkTagToWork(workId: string, tagId: string): Promise<void>;
  abstract fetchAllTagsPaged(page: number): Promise<{ tags: Tag[]; totalOfPages: number }>;
  abstract findAllTagsByWorkId(workId: string): Promise<Tag[]>;
  abstract updateTagList(workId: string, tagsToAdd: string[], tagsToRemove: string[]): Promise<void>;
}
