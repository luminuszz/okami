import { difference } from 'lodash';

export class WatchList {
  private readonly originalList: Map<string, string>;

  private static instance: WatchList;

  private constructor(list: string[]) {
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

  getRemovedList(newList: string[]): string[] {
    return difference(this.getList(), newList);
  }

  getAddedList(newList: string[]): string[] {
    return difference(newList, this.getList());
  }

  static create(list: string[]): WatchList {
    if (!WatchList.instance) {
      WatchList.instance = new WatchList(list);
    }

    return WatchList.instance;
  }
}
