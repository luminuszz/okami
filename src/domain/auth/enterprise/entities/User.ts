import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Work } from '@domain/work/enterprise/entities/work';

export enum PaymentSubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

interface EntityProps {
  name: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
  avatarImageId?: string;
  works?: Work[];
  readingWorksCount?: number;
  finishedWorksCount?: number;
  adminHashCodeKey?: string | null;
  notionDatabaseId?: string;
  paymentSubscriptionId?: string;
  paymentSubscriberId?: string;
  paymentSubscriptionStatus?: PaymentSubscriptionStatus;
  trialWorkLimit?: number;
}

export class User extends Entity<EntityProps> {
  private constructor(props: Omit<EntityProps, 'updatedAt'>, id?: UniqueEntityID) {
    super(props, id);

    this.props.createdAt = props.createdAt ?? new Date();
    this.props.works = props.works ?? [];
    this.props.readingWorksCount = props.readingWorksCount ?? 0;
    this.props.finishedWorksCount = props.finishedWorksCount ?? 0;
    this.props.adminHashCodeKey = props.adminHashCodeKey ?? null;
    this.props.paymentSubscriptionStatus = props.paymentSubscriptionStatus ?? PaymentSubscriptionStatus.INACTIVE;
    this.props.trialWorkLimit = props.trialWorkLimit ?? 5;
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get name(): string {
    return this.props.name;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get avatarImageId(): string {
    return this.props.avatarImageId;
  }

  set avatarImageId(url: string) {
    this.props.avatarImageId = url;
    this.refresh();
  }

  get works(): Work[] {
    return this.props.works;
  }

  get adminHashCodeKey(): string | null {
    return this.props.adminHashCodeKey;
  }

  get readingWorksCount(): number {
    return this.props.readingWorksCount;
  }

  get finishedWorksCount(): number {
    return this.props.finishedWorksCount;
  }

  set adminHashCodeKey(key: string | null) {
    this.props.adminHashCodeKey = key;
    this.refresh();
  }

  set passwordHash(passwordHash: string) {
    this.props.passwordHash = passwordHash;
    this.refresh();
  }

  private refresh() {
    this.props.updatedAt = new Date();
  }

  public get notionDatabaseId(): string {
    return this.props.notionDatabaseId;
  }

  public set notionDatabaseId(id: string) {
    this.props.notionDatabaseId = id;
    this.refresh();
  }
  public get paymentSubscriptionId() {
    return this.props.paymentSubscriptionId;
  }

  public get paymentSubscriptionStatus() {
    return this.props.paymentSubscriptionStatus;
  }

  public set paymentSubscriptionStatus(paymentSubscriptionStatus: PaymentSubscriptionStatus) {
    this.props.paymentSubscriptionStatus = paymentSubscriptionStatus;
    this.refresh();
  }

  public set paymentSubscriptionId(paymentSubscriptionId: string) {
    this.props.paymentSubscriptionId = paymentSubscriptionId;
    this.refresh();
  }

  public get paymentSubscriberId() {
    return this.props.paymentSubscriberId;
  }

  public set paymentSubscriberId(paymentSubscriberId: string) {
    this.props.paymentSubscriberId = paymentSubscriberId;
    this.refresh();
  }

  public get trialWorkLimit() {
    return this.props.trialWorkLimit;
  }

  public get hasTrial() {
    return this.props.trialWorkLimit > 0;
  }

  public decreaseTrialWorkLimit() {
    this.props.trialWorkLimit = this.hasTrial ? this.props.trialWorkLimit - 1 : 0;
  }

  public static create(props: EntityProps, id?: UniqueEntityID): User {
    return new User(props, id);
  }
}
