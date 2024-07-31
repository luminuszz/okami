import { difference } from 'lodash';

export class WatchList {
  private readonly originalList: Map<string, string>;

  constructor(list: string[]) {
    this.originalList = new Map(list.map((item) => [item, item]));
  }

  setToList(data: string): void {
    this.originalList.set(data, data);
  }

  removeFromList(id: string): void {
    this.originalList.delete(id);
  }

  getList(): string[] {
    return Array.from(this.originalList.values());
  }

  getRemovedList(list: string[]): string[] {
    return difference(this.getList(), list);
  }

  getAddedList(list: string[]): string[] {
    return difference(list, this.getList());
  }
}