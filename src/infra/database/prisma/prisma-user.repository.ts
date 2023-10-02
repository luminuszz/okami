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

    const { readingWorksCount, finishedWorksCount } = await this.findUserWorkMetaData(results.id);

    return results ? parsePrismaUserToDomainUser({ ...results, finishedWorksCount, readingWorksCount }) : undefined;
  }

  async findById(id: string): Promise<User | undefined> {
    const results = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    const { readingWorksCount, finishedWorksCount } = await this.findUserWorkMetaData(results.id);

    return results
      ? parsePrismaUserToDomainUser({
          ...results,
          finishedWorksCount: readingWorksCount,
          readingWorksCount: finishedWorksCount,
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
    const [totalOfWorksReading, totalOfWorksRead] = await Promise.all([
      this.prisma.work.count({ where: { userId: id, isFinished: false } }),
      this.prisma.work.count({ where: { userId: id } }),
    ]);

    return {
      readingWorksCount: totalOfWorksReading,
      finishedWorksCount: totalOfWorksRead,
    };
  }
}
