import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { WorkMarkReadEvent } from './events/work-marked-read.';
import { WorkMarkUnreadEvent } from './events/work-marked-unread';
import { Chapter } from './values-objects/chapter';

interface WorkProps {
  name: string;
  url: string;
  chapter: Chapter;
  hasNewChapter: boolean;
  updatedAt?: Date;
  createdAt: Date;
  category: Category;
  recipientId?: string;
}

export enum Category {
  MANGA = 'MANGA',
  ANIME = 'ANIME',
}

export class Work extends Entity<WorkProps> {
  private constructor(props: WorkProps, id?: UniqueEntityID) {
    super(props, id);

    this.props.createdAt = props.createdAt ?? new Date();

    if (this.props.updatedAt) {
      this.props.updatedAt = props.updatedAt;
    }
  }

  public static create(props: WorkProps, id?: UniqueEntityID): Work {
    const work = new Work(props, id);

    return work;
  }

  public get name() {
    return this.props.name;
  }

  public get url() {
    return this.props.url;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get chapter() {
    return this.props.chapter;
  }

  public get hasNewChapter() {
    return this.props.hasNewChapter;
  }

  public get category() {
    return this.props.category;
  }
  public get recipientId() {
    return this.props.recipientId;
  }

  public setRecipientId(recipientId: string) {
    this.props.recipientId = recipientId;
    this.commit();
  }

  private commit() {
    this.props.updatedAt = new Date();
  }

  updateChapter(newChapter: number): void {
    this.props.chapter.updateChapter(newChapter);
    this.commit();
  }

  markAsRead(): void {
    this.props.hasNewChapter = false;
    this.events.push(new WorkMarkReadEvent(this));
    this.commit();
  }

  markAsUnread(): void {
    this.props.hasNewChapter = true;
    this.events.push(new WorkMarkUnreadEvent(this));
    this.commit();
  }
}
