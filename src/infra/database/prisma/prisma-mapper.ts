import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Notification } from '@domain/notification/enterprise/entities/notification';
import { Content } from '@domain/notification/enterprise/values-objects/content';
import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Category, RefreshStatus, Work } from '@domain/work/enterprise/entities/work';

import {
  AccessToken as PrismaAccessToken,
  Category as PrismaCategory,
  Notification as PrismaNotification,
  User as PrismaUser,
  Work as PrismaWork,
  RefreshStatus as PrismaRefreshStatus,
  UserNotificationSubscription as PrismaUserNotificationSubscription,
  NotificationType as PrismaNotificationType,
  PaymentSubscriptionStatus as PrismaPaymentSubscriptionStatus,
} from '@prisma/client';
import { PaymentSubscriptionStatus, User } from '@domain/auth/enterprise/entities/User';
import { AccessToken } from '@domain/auth/enterprise/entities/AccessToken';
import { map } from 'lodash';
import {
  UserNotificationSubscription,
  NotificationType,
} from '@domain/notification/enterprise/entities/user-notification-subscription';

export const enumMapper = (category: Category): PrismaCategory => {
  return PrismaCategory[category];
};

export const refreshStatusEnumMapper = (refreshStatus?: RefreshStatus): PrismaRefreshStatus => {
  return refreshStatus ? PrismaRefreshStatus[refreshStatus] : null;
};

export const paymentSubscriptionStatusEnumMapper = (
  status?: PaymentSubscriptionStatus,
): PrismaPaymentSubscriptionStatus => PrismaPaymentSubscriptionStatus[status];

interface PrismaUserWithMeta extends PrismaUser {
  readingWorksCount: number;
  finishedWorksCount: number;
}

export const workEntityToPrismaMapper = (work: Work): PrismaWork => ({
  category: enumMapper(work.category),
  chapters: work.chapter.getChapter(),
  nextChapter: work.nextChapter?.getChapter(),
  nextChapterUpdatedAt: work.nextChapterUpdatedAt,
  hasNewChapter: work.hasNewChapter,
  name: work.name,
  createdAt: work.createdAt,
  id: work.id.toString(),
  updatedAt: work.updatedAt,
  url: work.url,
  recipientId: work.recipientId,
  isFinished: work.isFinished,
  imageId: work.imageId,
  userId: work.userId,
  isUpserted: null,
  refreshStatus: refreshStatusEnumMapper(work.refreshStatus),
  isDropped: work.isDropped,
});

export const prismaWorkToEntityMapper = (prismaWork: PrismaWork): Work => {
  return Work.create(
    {
      category: prismaWork.category as Category,
      chapter: new Chapter(prismaWork.chapters),
      createdAt: prismaWork.createdAt,
      hasNewChapter: prismaWork.hasNewChapter,
      name: prismaWork.name,
      url: prismaWork.url,
      updatedAt: prismaWork.updatedAt,
      recipientId: prismaWork.recipientId,
      isFinished: prismaWork.isFinished,
      imageId: prismaWork.imageId,
      nextChapter: new Chapter(prismaWork.nextChapter),
      nextChapterUpdatedAt: prismaWork.nextChapterUpdatedAt,
      userId: prismaWork.userId,
      refreshStatus: prismaWork.refreshStatus as RefreshStatus,
      isDropped: prismaWork.isDropped,
    },
    new UniqueEntityID(prismaWork.id),
  );
};

export const parseNotificationEntityToPrisma = (notification: Notification): PrismaNotification => ({
  content: notification.content.toString(),
  createdAt: notification.createdAt,
  id: notification.id.toString(),
  readAt: notification.readAt,
  recipientId: notification.recipientId,
  workId: notification.workId,
});

export const parsePrismaToNotificationEntity = (prismaNotification: PrismaNotification): Notification =>
  Notification.create(
    {
      content: new Content(prismaNotification.content),
      recipientId: prismaNotification.recipientId,
      createdAt: prismaNotification.createdAt,
      readAt: prismaNotification.readAt,
      workId: prismaNotification.workId,
    },
    new UniqueEntityID(prismaNotification.id),
  );

const isPrismaWithMeta = (data: any): data is PrismaUserWithMeta => {
  return data.readingWorksCount !== undefined && data.finishedWorksCount !== undefined;
};

export const parsePrismaUserToDomainUser = (prismaUser: PrismaUserWithMeta | PrismaUser): User =>
  User.create(
    {
      name: prismaUser.name,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      passwordHash: prismaUser.passwordHash,
      email: prismaUser.email,
      avatarImageId: prismaUser.imageUrl,
      readingWorksCount: isPrismaWithMeta(prismaUser) ? prismaUser?.readingWorksCount : 0,
      finishedWorksCount: isPrismaWithMeta(prismaUser) ? prismaUser?.finishedWorksCount : 0,
      adminHashCodeKey: prismaUser.adminHashCodeKey,
      notionDatabaseId: prismaUser.notionDatabaseId,
      paymentSubscriptionId: prismaUser.paymentSubscriptionId,
      paymentSubscriberId: prismaUser.paymentSubscriberId,
      paymentSubscriptionStatus: prismaUser.paymentSubscriptionStatus as PaymentSubscriptionStatus,
    },
    new UniqueEntityID(prismaUser.id),
  );

export const parseDomainUserToPrismaUser = (user: User): PrismaUser => ({
  updatedAt: user.updatedAt,
  passwordHash: user.passwordHash,
  email: user.email,
  name: user.name,
  createdAt: user.createdAt,
  id: user.id.toString(),
  imageUrl: user.avatarImageId,
  worksId: map(user.works, (work) => work.id),
  adminHashCodeKey: user.adminHashCodeKey,
  notionDatabaseId: user.notionDatabaseId,
  paymentSubscriptionId: user.paymentSubscriptionId,
  paymentSubscriberId: user.paymentSubscriberId,
  paymentSubscriptionStatus: user.paymentSubscriptionStatus,
});

export const parseDomainAccessTokenToPrismaAccessToken = (accessToken: AccessToken): PrismaAccessToken => ({
  token: accessToken.token,
  createdAt: accessToken.createdAt,
  id: accessToken.id,
  userId: accessToken.userId,
  revokedAt: accessToken.revokedAt,
});

export const parsePrismaAccessTokenToDomainAccessToken = (prismaAccessToken: PrismaAccessToken): AccessToken =>
  AccessToken.create({
    token: prismaAccessToken.token,
    createdAt: prismaAccessToken.createdAt,
    revokedAt: prismaAccessToken.revokedAt,
    userId: prismaAccessToken.userId,
  });

export const notificationTypeEnumMapper = (notificationType?: NotificationType): PrismaNotificationType => {
  return notificationType ? PrismaNotificationType[notificationType] : null;
};

export const parsePrismaUserNotificationSubscriptionToDomain = (
  data: PrismaUserNotificationSubscription,
): UserNotificationSubscription =>
  UserNotificationSubscription.create({
    notificationType: data.notificationType as any,
    subscriptionId: data.id,
    userId: data.userId,
    createdAt: data.createdAt,
    credentials: data.credentials as Record<string, any>,
  });
