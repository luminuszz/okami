export class Chapter {
  private value: number;

  constructor(chapter: number) {
    this.value = chapter;
  }

  public updateChapter(newChapter: number): void {
    this.value = newChapter;
  }

  public getChapter(): number {
    return this.value;
  }
}
