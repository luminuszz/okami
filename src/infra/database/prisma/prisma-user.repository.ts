import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { User } from '@domain/auth/enterprise/entities/User';
import { parseDomainUserToPrismaUser, parsePrismaUserToDomainUser } from '@infra/database/prisma/prisma-mapper';

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
      this.prisma.work.count({ where: { userId: id, isFinished: false } }),
      this.prisma.work.count({ where: { userId: id, isFinished: true } }),
    ]);

    return {
      readingWorksCount: totalOfWorksReading,
      finishedWorksCount: totalOfWorksRead,
    };
  }
}
