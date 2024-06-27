import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Work } from '@domain/work/enterprise/entities/work';
import { UserEmailUpdated } from '../events/user-email-updated';
import { Replace } from '@core/helpers/replace';

export enum PaymentSubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUBSCRIBED_USER = 'SUBSCRIBED_USER',
}

interface EntityProps {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date | null;
  avatarImageId: string | null;
  works: Work[];
  role: UserRole;
  readingWorksCount: number;
  finishedWorksCount: number;
  adminHashCodeKey: string | null;
  notionDatabaseId?: string;
  paymentSubscriptionId?: string;
  paymentSubscriberId?: string;
  paymentSubscriptionStatus?: PaymentSubscriptionStatus;
  trialWorkLimit?: number;
  resetPasswordCode: string | null;
}

type ReplaceProps = Replace<
  EntityProps,
  {
    createdAt?: Date;
    updatedAt?: Date;
    avatarImageId?: string;
    works?: Work[];
    role?: UserRole;
    readingWorksCount?: number;
    finishedWorksCount?: number;
    adminHashCodeKey?: string;
    resetPasswordCode?: string;
  }
>;

export const DEFAULT_TRIAL_WORK_LIMIT = 5;

export class User extends Entity<EntityProps> {
  readonly __typename = 'User';

  private constructor(props: ReplaceProps, id?: UniqueEntityID) {
    super(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        works: props.works ?? [],
        readingWorksCount: props.readingWorksCount ?? 0,
        finishedWorksCount: props.finishedWorksCount ?? 0,
        adminHashCodeKey: props.adminHashCodeKey ?? null,
        paymentSubscriptionStatus: props.paymentSubscriptionStatus ?? PaymentSubscriptionStatus.INACTIVE,
        trialWorkLimit: props.trialWorkLimit ?? DEFAULT_TRIAL_WORK_LIMIT,
        resetPasswordCode: props.resetPasswordCode ?? null,
        role: props.role ?? UserRole.USER,
        updatedAt: null,
        avatarImageId: props.avatarImageId ?? null,
      },
      id,
    );
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    if (this.props.email !== email) {
      this.events.push(new UserEmailUpdated(this));
    }

    this.props.email = email;
    this.refresh();
  }
  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt ?? null;
  }

  get createdAt(): Date {
    return this.props.createdAt || new Date();
  }

  get avatarImageId(): string | null {
    return this.props.avatarImageId ?? null;
  }

  get resetPasswordCode() {
    return this.props.resetPasswordCode;
  }

  set resetPasswordCode(code: string | null) {
    this.props.resetPasswordCode = code;
    this.refresh();
  }

  set avatarImageId(url: string) {
    this.props.avatarImageId = url;
    this.refresh();
  }

  get works(): Work[] {
    return this.props.works ?? [];
  }

  get adminHashCodeKey(): string | null {
    return this.props.adminHashCodeKey ?? null;
  }

  get readingWorksCount(): number {
    return this.props.readingWorksCount ?? 0;
  }

  get finishedWorksCount(): number {
    return this.props.finishedWorksCount ?? 0;
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

  public get notionDatabaseId(): string | null {
    return this.props.notionDatabaseId ?? null;
  }

  public set notionDatabaseId(id: string) {
    this.props.notionDatabaseId = id;
    this.refresh();
  }

  public get paymentSubscriptionId(): string | null {
    return this.props.paymentSubscriptionId ?? null;
  }

  public get paymentSubscriptionStatus(): PaymentSubscriptionStatus | null {
    return this.props.paymentSubscriptionStatus ?? null;
  }

  get role() {
    return this.props.role ?? UserRole.USER;
  }

  set role(role: UserRole) {
    this.props.role = role;
    this.refresh();
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
    return this.props.paymentSubscriberId ?? '';
  }

  public set paymentSubscriberId(paymentSubscriberId: string) {
    this.props.paymentSubscriberId = paymentSubscriberId;
    this.refresh();
  }

  public get trialWorkLimit() {
    return this.props.trialWorkLimit;
  }

  public get hasTrial() {
    return this.props.trialWorkLimit && this.props.trialWorkLimit > 0;
  }

  public isAdmin() {
    return this.props.role === UserRole.ADMIN;
  }

  public decreaseTrialWorkLimit() {
    if (!this.props.trialWorkLimit) {
      return;
    }

    this.props.trialWorkLimit = this.hasTrial ? this.props.trialWorkLimit - 1 : 0;
  }

  public static create(props: ReplaceProps, id?: UniqueEntityID): User {
    return new User(props, id);
  }
}
