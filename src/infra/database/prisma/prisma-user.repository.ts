import { UserMetadata, UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { User } from '@domain/auth/enterprise/entities/User';
import { parseDomainUserToPrismaUser, parsePrismaUserToDomainUser } from '@infra/database/prisma/prisma-mapper';
import { WorkStatus } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = parseDomainUserToPrismaUser(user);

    await this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const results = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!results) return null;

    const { readingWorksCount, finishedWorksCount } = await this.findUserWorkMetaData(results.id);

    return parsePrismaUserToDomainUser({ ...results, finishedWorksCount, readingWorksCount });
  }

  async findById(id: string): Promise<User | null> {
    const results = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!results) return null;

    const { readingWorksCount, finishedWorksCount } = await this.findUserWorkMetaData(results.id);

    return results
      ? parsePrismaUserToDomainUser({
          ...results,
          finishedWorksCount: finishedWorksCount,
          readingWorksCount: readingWorksCount,
        })
      : undefined;
  }

  async save(user: User): Promise<void> {
    const { id, ...data } = parseDomainUserToPrismaUser(user);

    await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async findUserWorkMetaData(id: string): Promise<{ readingWorksCount: number; finishedWorksCount: number }> {
    const [totalOfWorksReading, totalOfWorksRead] = await this.prisma.$transaction([
      this.prisma.work.count({ where: { userId: id, status: { not: WorkStatus.FINISHED } } }),
      this.prisma.work.count({ where: { userId: id, status: WorkStatus.FINISHED } }),
    ]);

    return {
      readingWorksCount: totalOfWorksReading,
      finishedWorksCount: totalOfWorksRead,
    };
  }

  async findUserByPaymentSubscriptionId(paymentSubscriptionId: string) {
    const results = await this.prisma.user.findUnique({
      where: {
        paymentSubscriptionId,
      },
    });

    return results ? parsePrismaUserToDomainUser(results) : null;
  }

  async findUserByPaymentSubscriberId(paymentSubscriberId: string) {
    const results = await this.prisma.user.findUnique({
      where: {
        paymentSubscriberId,
      },
    });

    return results ? parsePrismaUserToDomainUser(results) : null;
  }

  async fetchUserMetaData(userId: string): Promise<UserMetadata> {
    const values = await this.prisma.work.groupBy({
      by: ['status'],
      _count: true,

      where: {
        userId,
      },
    });

    const parsedValues = values.reduce(
      (acc, curr) => ({ ...acc, [curr.status]: curr._count }),
      {} as Record<WorkStatus, number>,
    );

    console.log(parsedValues.DROPPED, parsedValues.FINISHED, parsedValues.READ, parsedValues.UNREAD);

    const [totalOfWorksRead, totalOfWorksCreated, totalOfWorksUnread, totalOfWorksFinished] =
      await this.prisma.$transaction([
        this.prisma.work.count({ where: { userId, status: WorkStatus.READ } }),
        this.prisma.work.count({ where: { userId } }),
        this.prisma.work.count({ where: { userId, status: WorkStatus.UNREAD } }),
        this.prisma.work.count({ where: { userId, status: WorkStatus.FINISHED } }),
      ]);

    console.log(totalOfWorksRead, totalOfWorksCreated, totalOfWorksUnread, totalOfWorksFinished);

    return {
      totalOfWorksRead,
      totalOfWorksCreated,
      totalOfWorksUnread,
      totalOfWorksFinished,
    };
  }

  async finsUserByPasswordResetCode(code: string): Promise<User> {
    const results = await this.prisma.user.findFirst({
      where: {
        resetPasswordCode: code,
      },
    });

    return results ? parsePrismaUserToDomainUser(results) : null;
  }
}
