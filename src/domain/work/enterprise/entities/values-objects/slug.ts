export class Slug {
  private readonly value: string;

  constructor(slug: string) {
    this.value = slug
      .normalize('NFD')
      .toLocaleLowerCase()
      .replaceAll(/[\u0300-\u036f]/g, '')
      .replaceAll(' ', '-')
      .replaceAll('---', '-')
      .normalize('NFC');
  }

  get name(): string {
    return this.value;
  }
}
