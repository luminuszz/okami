export class Slug {
  private value: string;

  constructor(slug: string) {
    this.value = slug.toLocaleLowerCase().replaceAll(' ', '-');
  }

  get name(): string {
    return this.value;
  }
}
