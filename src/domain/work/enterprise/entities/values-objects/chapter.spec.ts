import { Chapter } from './chapter';

describe('Chapter', () => {
  it('should be able to update chapter', () => {
    const chapter = new Chapter(1);

    chapter.updateChapter(2);

    expect(chapter.getChapter()).toBe(2);
  });
});
