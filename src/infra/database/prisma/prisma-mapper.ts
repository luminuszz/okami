import { UniqueEntityID } from '@core/entities/unique-entity-id';

import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Category, RefreshStatus, Work, WorkStatus } from '@domain/work/enterprise/entities/work';

import { AccessToken } from '@domain/auth/enterprise/entities/AccessToken';
import { RefreshToken } from '@domain/auth/enterprise/entities/RefreshToken';
import { PaymentSubscriptionStatus, User, UserRole } from '@domain/auth/enterprise/entities/User';
import { EmailValidationCode } from '@domain/auth/enterprise/value-objects/email-validation-code';
import { SearchToken, SearchTokenType } from '@domain/work/enterprise/entities/search-token';
import { Tag } from '@domain/work/enterprise/entities/tag';
import { Slug } from '@domain/work/enterprise/entities/values-objects/slug';
import {
  AccessToken as PrismaAccessToken,
  Category as PrismaCategory,
  PaymentSubscriptionStatus as PrismaPaymentSubscriptionStatus,
  RefreshStatus as PrismaRefreshStatus,
  RefreshToken as PrismaRefreshToken,
  SearchToken as PrismaSearchToken,
  Tag as PrismaTag,
  User as PrismaUser,
  Work as PrismaWork,
} from '@prisma/client';
import { map } from 'lodash';

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

interface PrismaWorkWithTags extends PrismaWork {
  tags?: PrismaTag[];
}

export const workEntityToPrismaMapper = (work: Work): PrismaWork => ({
  category: enumMapper(work.category),
  chapters: work.chapter.getChapter(),
  nextChapter: work.nextChapter?.getChapter(),
  nextChapterUpdatedAt: work.nextChapterUpdatedAt,
  name: work.name,
  createdAt: work.createdAt,
  id: work.id.toString(),
  updatedAt: work.updatedAt,
  url: work.url,
  recipientId: work.recipientId,
  imageId: work.imageId,
  userId: work.userId,
  isUpserted: null,
  refreshStatus: refreshStatusEnumMapper(work.refreshStatus),
  status: work.status as WorkStatus,
  tagsId: work.tagsId,
  alternativeName: work.alternativeName,
  isFavorite: work.isFavorite,
  description: work.description,
});

export const prismaWorkToEntityMapper = (prismaWork: PrismaWorkWithTags): Work => {
  return Work.create(
    {
      category: prismaWork.category as Category,
      chapter: new Chapter(prismaWork.chapters),
      createdAt: prismaWork.createdAt,
      name: prismaWork.name,
      url: prismaWork.url,
      updatedAt: prismaWork.updatedAt,
      recipientId: prismaWork.recipientId,
      imageId: prismaWork.imageId,
      nextChapter: new Chapter(prismaWork.nextChapter),
      nextChapterUpdatedAt: prismaWork.nextChapterUpdatedAt,
      userId: prismaWork.userId,
      refreshStatus: prismaWork.refreshStatus as RefreshStatus,
      status: prismaWork.status as WorkStatus,
      tags: prismaWork.tags?.map(prismaTagToEntityTag) ?? [],
      alternativeName: prismaWork.alternativeName,
      isFavorite: prismaWork.isFavorite,
      description: prismaWork.description,
    },
    new UniqueEntityID(prismaWork.id),
  );
};

export const prismaTagToEntityTag = (tag: PrismaTag): Tag => {
  return Tag.create(
    { name: tag.name, createdAt: tag.createdAt, updatedAt: tag.updatedAt, slug: new Slug(tag.name), color: tag.color },
    new UniqueEntityID(tag.id),
  );
};

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
      trialWorkLimit: prismaUser.trialWorkLimit,
      resetPasswordCode: prismaUser.resetPasswordCode,
      role: prismaUser.role as UserRole,
      emailValidationCode: prismaUser.validateEmailCode
        ? new EmailValidationCode(
            prismaUser.validateEmailCode,
            prismaUser.emailIsValidated,
            prismaUser.emailValidationCodeExpirationAt,
          )
        : null,
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
  trialWorkLimit: user.trialWorkLimit,
  resetPasswordCode: user.resetPasswordCode,
  role: user.role,
  emailIsValidated: user?.isEmailValidated ?? false,
  validateEmailCode: user?.emailCode || null,
  emailValidationCodeExpirationAt: user?.emailCodeExpiresAt ?? null,
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

export const parsePrismaSearchTokenToDomain = (prismaSearchToken: PrismaSearchToken): SearchToken => {
  return SearchToken.create(
    {
      token: prismaSearchToken.token,
      createdAt: prismaSearchToken.createdAt,
      type: SearchTokenType[prismaSearchToken.type],
    },
    new UniqueEntityID(prismaSearchToken.id),
  );
};

export const parsePrismaRefreshTokenToDomain = (prismaRefreshToken: PrismaRefreshToken): RefreshToken => {
  return RefreshToken.create({
    token: prismaRefreshToken.token,
    expiresAt: prismaRefreshToken.expiresAt,
    userId: prismaRefreshToken.userId,
    createdAt: prismaRefreshToken.createdAt,
    invalidatedAt: prismaRefreshToken.invalidatedAt,
  });
};
