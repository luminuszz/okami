import { SameChapterError } from '../errors/same-chapter-error';

export class Chapter {
  private value: number;

  constructor(chapter: number) {
    this.value = chapter;
  }

  public updateChapter(newChapter: number): void {
    if (this.value >= newChapter) {
      throw new SameChapterError();
    }

    this.value = newChapter;
  }

  public getChapter(): number {
    return this.value;
  }
}
