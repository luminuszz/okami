import { UpdateTag } from '@domain/work/application/usecases/update-tag';
import { InMemoryTagRepository } from '@test/mocks/in-memory-tag-repository';
import { Tag } from '@domain/work/enterprise/entities/tag';
import { faker } from '@faker-js/faker';
import { Slug } from '@domain/work/enterprise/entities/values-objects/slug';
import { TagAlreadyExistsException, TagNotFoundException } from '@domain/work/application/usecases/errors/tag';

describe('UpdateTag', () => {
  let stu: UpdateTag;
  let tagRepository: InMemoryTagRepository;

  beforeEach(() => {
    tagRepository = new InMemoryTagRepository();
    stu = new UpdateTag(tagRepository);
  });

  it('should be able to update a tag', async () => {
    const tagName = faker.string.sample();

    const tag = Tag.create({
      slug: new Slug(tagName),
      color: faker.color.human(),
      name: tagName,
    });

    await tagRepository.create(tag);

    const newPayload = {
      name: faker.string.sample(),
      color: faker.color.human(),
    };

    const response = await stu.execute({
      id: tag.id,
      name: newPayload.name,
      color: newPayload.color,
    });

    expect(response.isRight()).toBeTruthy();

    if (response.isRight()) {
      const { tag: updatedTag } = response.value;

      const slugToMatch = new Slug(newPayload.name).name;

      expect(updatedTag.color).toBe(newPayload.color);
      expect(updatedTag.slug).toBe(slugToMatch);
      expect(updatedTag.name).toBe(newPayload.name);
    }
  });

  it('should not be able to update a tag if tag slug/name already exists', async () => {
    const tagName = faker.string.sample();

    const tag = Tag.create({
      slug: new Slug(tagName),
      color: faker.color.human(),
      name: tagName,
    });

    await tagRepository.create(tag);

    const response = await stu.execute({
      id: tag.id,
      name: tagName,
    });

    expect(response.isLeft()).toBeTruthy();

    expect(response.value).toBeInstanceOf(TagAlreadyExistsException);
  });

  it('should not be able to update a tag if tag not found', async () => {
    const tagName = faker.string.sample();

    const tag = Tag.create({
      slug: new Slug(tagName),
      color: faker.color.human(),
      name: tagName,
    });

    await tagRepository.create(tag);

    const response = await stu.execute({
      id: 'FAKER_TAG_ID',
      name: tagName,
    });

    expect(response.isLeft()).toBeTruthy();

    expect(response.value).toBeInstanceOf(TagNotFoundException);
  });
});
