import { Content } from '@domain/notification/enterprise/values-objects/content';

describe('Content', () => {
  it('should be able to create a new Content', () => {
    const content = new Content('content');

    expect(content.toString()).toBe('content');
  });

  it.failing('not should be able to create a new Content with empty value', () => {
    const content = new Content('content');

    expect(content.setContent('')).toThrowError('Content is empty');
  });
});
