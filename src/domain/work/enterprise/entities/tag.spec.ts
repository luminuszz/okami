import { Tag } from './tag';
import { Slug } from './values-objects/slug';

describe('TagEntity', () => {
  it('should be able to create new Tag', () => {
    const tag = Tag.create({
      createdAt: new Date(),
      name: 'Tag Name',
      slug: new Slug('Tag Name'),
    });

    expect(tag).toBeDefined();
    expect(tag.createdAt).toBeInstanceOf(Date);
    expect(tag.name).toBe('Tag Name');
    expect(tag.slug).toBe('tag-name');
  });

  it('should be able to update tag', () => {
    const tag = Tag.create({
      createdAt: new Date(),
      name: 'Tag Name',
      slug: new Slug('Tag Name'),
    });

    tag.name = 'New Tag Name';
    tag.slug = 'New Tag Name';

    expect(tag.name).toBe('New Tag Name');
    expect(tag.slug).toBe('new-tag-name');
    expect(tag.updatedAt).not.toBe(tag.createdAt);
  });
});
