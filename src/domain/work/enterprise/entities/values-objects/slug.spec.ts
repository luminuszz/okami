import { Slug } from './slug';

describe('Slug Value Object', () => {
  it('should create a slug', () => {
    const slug = new Slug('This is a slug');

    expect(slug).toBeInstanceOf(Slug);
    expect(slug).toBeDefined();
  });

  it('should return the slug name', () => {
    const slug = new Slug('This is a slug');

    expect(slug.name).toBe('this-is-a-slug');
  });
});
