import { TagRepository } from '@domain/work/application/repositories/tag-repository';
import { Tag } from '@domain/work/enterprise/entities/tag';

export class InMemoryTagRepository implements TagRepository {
  public tags: Tag[] = [];

  async fetchAllTagsPaged(page: number): Promise<Tag[]> {
    console.log(page);

    return this.tags;
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
    const tag = this.tags.find((t) => t.slug === slug);

    return tag;
  }
  async findById(id: string): Promise<Tag> {
    const tag = this.tags.find((t) => t.id === id);

    return tag;
  }

  async linkTagToWork(workId: string, tagId: string): Promise<void> {
    const tagIndex = this.tags.findIndex((t) => t.id === tagId);

    this.tags[tagIndex].worksId.push(workId);
  }
}
