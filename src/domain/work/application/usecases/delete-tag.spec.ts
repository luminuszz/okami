import { faker } from '@faker-js/faker';
import { InMemoryTagRepository } from '@test/mocks/in-memory-tag-repository';
import { Tag } from '@domain/work/enterprise/entities/tag';
import { Slug } from '@domain/work/enterprise/entities/values-objects/slug';
import { DeleteTag } from '@domain/work/application/usecases/delete-tag';
import { TagNotFoundException } from '@domain/work/application/usecases/errors/tag';

describe('DeleteTag', () => {
  let tagRepository: InMemoryTagRepository;
  let stu: DeleteTag;

  beforeEach(() => {
    tagRepository = new InMemoryTagRepository();
    stu = new DeleteTag(tagRepository);
  });

  it('should be able to delete a  Tag', async () => {
    const tag = Tag.create({
      name: faker.company.name(),
      color: faker.internet.color(),
      slug: new Slug(faker.lorem.slug()),
      createdAt: new Date(),
    });

    await tagRepository.create(tag);

    const results = await stu.execute({ tagId: tag.id });

    expect(results.isRight()).toBeTruthy();

    const tagDeleted = await tagRepository.findById(tag.id);
    expect(tagDeleted).toBeUndefined();
  });

  it('should not be able to delete a  Tag if not exists', async () => {
    const tag = Tag.create({
      name: faker.company.name(),
      color: faker.internet.color(),
      slug: new Slug(faker.lorem.slug()),
      createdAt: new Date(),
    });

    await tagRepository.create(tag);

    const results = await stu.execute({ tagId: 'FAKER_ID' });

    expect(results.isLeft()).toBeTruthy();

    expect(results.value).toBeInstanceOf(TagNotFoundException);

    expect(tagRepository.tags).toHaveLength(1);
  });
});
