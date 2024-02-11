import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { WorkMarkReadEvent } from './events/work-marked-read';
import { WorkMarkUnreadEvent } from './events/work-marked-unread';
import { Chapter } from './values-objects/chapter';
import { WorkMarkedFinishedEvent } from './events/work-marked-finished-event';
import { User } from '@domain/auth/enterprise/entities/User';
import { WorkRefreshStatusUpdatedEvent } from '@domain/work/enterprise/entities/events/work-refresh-status-updated';

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
  userId: string;
  refreshStatus?: RefreshStatus | null;
  isDropped?: boolean;
}

export enum Category {
  MANGA = 'MANGA',
  ANIME = 'ANIME',
}

export enum RefreshStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export class Work extends Entity<WorkProps> {
  private constructor(props: WorkProps, id?: UniqueEntityID) {
    super(props, id);

    this.props.createdAt = props.createdAt ?? new Date();
    this.props.isFinished = props.isFinished ?? false;
    this.props.subscribers = props.subscribers ?? [];
    this.props.nextChapter = props.nextChapter ?? null;
    this.props.nextChapterUpdatedAt = props.nextChapterUpdatedAt ?? null;
    this.props.refreshStatus = props.refreshStatus ?? null;
    this.props.isDropped = props.isDropped ?? false;

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

  public get userId() {
    return this.props.userId;
  }

  public get isDropped() {
    return this.props.isDropped;
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
    this.updateNextChapter(nextChapter);
    this.events.push(new WorkMarkUnreadEvent(this));
    this.commit();
  }

  public markAsFinished(): void {
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

  public get nextChapter() {
    return this.props.nextChapter;
  }

  public get nextChapterUpdatedAt() {
    return this.props.nextChapterUpdatedAt;
  }

  public get refreshStatus() {
    return this.props.refreshStatus;
  }

  public set refreshStatus(refreshStatus: RefreshStatus | null) {
    this.props.refreshStatus = refreshStatus;
    this.events.push(new WorkRefreshStatusUpdatedEvent(this));
    this.commit();
  }

  public set isDropped(isDropped: boolean) {
    this.props.isDropped = isDropped;
    this.commit();
  }

  public updateNextChapter(nextChapter: number | null) {
    this.props.nextChapter.updateChapter(nextChapter);
    this.props.nextChapterUpdatedAt = new Date();
    this.commit();
  }
}
