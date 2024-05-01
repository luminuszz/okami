import { faker } from '@faker-js/faker';
import { CreateTag } from './create-tag';
import { InMemoryTagRepository } from '@test/mocks/in-memory-tag-repository';

describe('CreateTag', () => {
  let createTag: CreateTag;
  let tagRepository: InMemoryTagRepository;

  beforeEach(() => {
    tagRepository = new InMemoryTagRepository();
    createTag = new CreateTag(tagRepository);
  });

  it('should be able to create new Tag', async () => {
    const payload = {
      name: faker.company.name(),
    };

    const response = await createTag.execute(payload);

    expect(response.isRight()).toBeTruthy();
    if (response.isRight()) {
      const { tag } = response.value;

      expect(tag.name).toBe(payload.name);
      expect(tag.createdAt).toBeDefined();
    }
  });
});
