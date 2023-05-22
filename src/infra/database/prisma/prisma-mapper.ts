import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Notification } from '@domain/notification/enterprise/entities/notification';
import { Content } from '@domain/notification/enterprise/values-objects/content';
import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Category, Work } from '@domain/work/enterprise/entities/work';
import {
  Category as PrismaCategory,
  Notification as PrismaNotification,
  Work as PrismaWork,
} from '@prisma/client';

export const enumMapper = (category: Category): PrismaCategory => {
  return PrismaCategory[category];
};

export const workEntityToPrismaMapper = (work: Work): PrismaWork => ({
  category: enumMapper(work.category),
  chapters: work.chapter.getChapter(),
  hasNewChapter: work.hasNewChapter,
  name: work.name,
  createdAt: work.createdAt,
  id: work.id.toString(),
  updatedAt: work.updatedAt,
  url: work.url,
  recipientId: work.recipientId,
});

export const prismaWorkToEntityMapper = (prismaWork: PrismaWork): Work => {
  const work = Work.create(
    {
      category: prismaWork.category as Category,
      chapter: new Chapter(prismaWork.chapters),
      createdAt: prismaWork.createdAt,
      hasNewChapter: prismaWork.hasNewChapter,
      name: prismaWork.name,
      url: prismaWork.url,
      updatedAt: prismaWork.updatedAt,
      recipientId: prismaWork.recipientId,
    },
    new UniqueEntityID(prismaWork.id),
  );

  return work;
};

export const parseNotificationEntityToPrisma = (
  notification: Notification,
): PrismaNotification => ({
  content: notification.content.toString(),
  createdAt: notification.createdAt,
  id: notification.id.toString(),
  readAt: notification.readAt,
  recipientId: notification.recipientId,
});

export const parsePrismaToNotificationEntity = (
  prismaNotification: PrismaNotification,
): Notification =>
  Notification.create(
    {
      content: new Content(prismaNotification.content),
      recipientId: prismaNotification.recipientId,
      createdAt: prismaNotification.createdAt,
      readAt: prismaNotification.readAt,
    },
    new UniqueEntityID(prismaNotification.id),
  ); 