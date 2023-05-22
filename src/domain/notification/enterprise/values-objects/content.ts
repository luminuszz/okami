export class Content {
  constructor(private _content: string) {}

  setContent(content: string): void {
    if (this._content.length < 0) {
      throw new Error('Content is empty');
    }

    this._content = content;
  }

  toString(): string {
    return this._content;
  }
}
