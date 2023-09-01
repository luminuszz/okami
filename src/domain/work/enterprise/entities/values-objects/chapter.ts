export class Chapter {
  private value: number;

  private updatedAt: Date | null;

  constructor(chapter: number, updatedAt?: Date) {
    this.value = chapter;
    this.updatedAt = updatedAt ?? null;
  }

  public updateChapter(newChapter: number): void {
    this.value = newChapter;
    this.updatedAt = new Date();
  }

  public getChapter(): number {
    return this.value;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
