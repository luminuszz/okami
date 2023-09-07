import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { WorkMarkReadEvent } from './events/work-marked-read';
import { WorkMarkUnreadEvent } from './events/work-marked-unread';
import { Chapter } from './values-objects/chapter';
import { WorkMarkedFinishedEvent } from './events/work-marked-finished-event';
import { User } from '@domain/auth/enterprise/entities/User';

interface WorkProps {
  name: string;
  url: string;
  chapter: Chapter;
  hasNewChapter: boolean;
  updatedAt?: Date;
  createdAt: Date;
  category: Category;
  recipientId?: string;
  isFinished?: boolean;
  imageId?: string;
  subscribers?: User[];
  nextChapter?: Chapter;
  nextChapterUpdatedAt?: Date;
}

export enum Category {
  MANGA = 'MANGA',
  ANIME = 'ANIME',
}

export class Work extends Entity<WorkProps> {
  private constructor(props: WorkProps, id?: UniqueEntityID) {
    super(props, id);

    this.props.createdAt = props.createdAt ?? new Date();
    this.props.isFinished = props.isFinished ?? false;
    this.props.subscribers = props.subscribers ?? [];
    this.props.nextChapter = props.nextChapter ?? null;
    this.props.nextChapterUpdatedAt = props.nextChapterUpdatedAt ?? null;

    if (this.props.updatedAt) {
      this.props.updatedAt = props.updatedAt;
    }
  }

  public static create(props: WorkProps, id?: UniqueEntityID): Work {
    return new Work(props, id);
  }

  public get name() {
    return this.props.name;
  }

  public set name(name: string) {
    this.props.name = name;
    this.commit();
  }

  public get url() {
    return this.props.url;
  }
  public set url(url: string) {
    this.props.url = url;
    this.commit();
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
    this.updateNextChapter(null);
    this.events.push(new WorkMarkReadEvent(this));
    this.commit();
  }

  markAsUnread(nextChapter: number): void {
    this.props.hasNewChapter = true;
    this.updateChapter(nextChapter);
    this.events.push(new WorkMarkUnreadEvent(this));
    this.commit();
  }

  public markAsFinished(): void {
    if (this.props.isFinished) return;

    this.props.isFinished = true;
    this.events.push(new WorkMarkedFinishedEvent(this));
    this.commit();
  }

  public get isFinished() {
    return this.props.isFinished;
  }

  public get imageId() {
    return this.props.imageId;
  }

  public set imageId(imageUrl: string) {
    this.props.imageId = imageUrl;
    this.commit();
  }

  public get subscribers() {
    return this.props.subscribers;
  }

  public get nextChapter() {
    return this.props.nextChapter;
  }

  public get nextChapterUpdatedAt() {
    return this.props.nextChapterUpdatedAt;
  }

  public updateNextChapter(nextChapter: number | null) {
    this.props.nextChapter.updateChapter(nextChapter);
    this.props.nextChapterUpdatedAt = new Date();
    this.commit();
  }

  public addSubscriber(subscriber: User): void {
    const alreadySubscribed = this.props.subscribers.find((current) => subscriber.equals(current));

    if (!alreadySubscribed) {
      this.props.subscribers.push(subscriber);
      this.commit();
    }
  }
}
