import { TagRepository } from '@domain/work/application/repositories/tag-repository';
import { Tag } from '@domain/work/enterprise/entities/tag';

export class InMemoryTagRepository implements TagRepository {
  async findAllTagsByWorkId(workId: string): Promise<Tag[]> {
    return this.tags.filter((t) => t.worksId.includes(workId));
  }
  async updateTagList(workId: string, tagsToAdd: string[], tagsToRemove: string[]): Promise<void> {}

  public tags: Tag[] = [];

  async fetchAllTagsPaged(page: number): Promise<{ tags: Tag[]; totalOfPages: number }> {
    console.log(page);

    return {
      tags: this.tags,
      totalOfPages: this.tags.length,
    };
  }

  async create(tag: Tag): Promise<void> {
    this.tags.push(tag);
  }
  async save(tag: Tag): Promise<void> {
    const tagIndex = this.tags.findIndex((t) => t.id === tag.id);

    this.tags[tagIndex] = tag;
  }
  async delete(id: string): Promise<void> {
    const tagIndex = this.tags.findIndex((t) => t.id === id);

    delete this.tags[tagIndex];
  }
  async findBySlug(slug: string): Promise<Tag> {
    return this.tags.find((t) => t.slug === slug);
  }
  async findById(id: string): Promise<Tag> {
    return this.tags.find((t) => t?.id === id);
  }

  async linkTagToWork(workId: string, tagId: string): Promise<void> {
    const tagIndex = this.tags.findIndex((t) => t.id === tagId);

    this.tags[tagIndex].worksId.push(workId);
  }
}
