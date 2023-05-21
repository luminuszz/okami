import { SameChapterError } from '../errors/same-chapter-error';
import { Chapter } from './chapter';

describe('Chapter', () => {
  it('should be able to update chapter', () => {
    const chapter = new Chapter(1);

    chapter.updateChapter(2);

    expect(chapter.getChapter()).toBe(2);
  });

  it.fails(
    'should not be able to update chapter if newChapter is equal or lest than current chapter ',
    () => {
      const chapter = new Chapter(1);

      expect(chapter.updateChapter(1)).rejects.toBeInstanceOf(SameChapterError);
    },
  );
});
