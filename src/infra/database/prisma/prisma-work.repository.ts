import { FetchUserWorksInput, WorkRepository } from '@domain/work/application/repositories/work-repository';
import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable, Logger } from '@nestjs/common';
import { map, omit } from 'lodash';
import { prismaWorkToEntityMapper, workEntityToPrismaMapper } from './prisma-mapper';
import { PrismaService } from './prisma.service';
import { RefreshStatus } from '@prisma/client';

@Injectable()
export class PrismaWorkRepository implements WorkRepository {
  private logger = new Logger(PrismaWorkRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async fetchWorksByUserIdWithFilters({ userId, status }: FetchUserWorksInput): Promise<Work[]> {
    const parserFilter = {
      unread: {
        hasNewChapter: true,
      },
      read: {
        hasNewChapter: false,
      },
      finished: {
        isFinished: true,
      },
      dropped: {
        isDropped: true,
      },
    };

    const filter = parserFilter[status] ?? {};

    const results = await this.prisma.work.findMany({
      where: {
        ...filter,
        userId,
      },
    });

    return results.map(prismaWorkToEntityMapper);
  }

  async create(work: Work): Promise<void> {
    const data = workEntityToPrismaMapper(work);

    await this.prisma.work.create({
      data,
    });
  }
  async save(work: Work): Promise<void> {
    const parsedData = workEntityToPrismaMapper(work);

    delete parsedData.id;

    await this.prisma.work.update({
      where: {
        id: work.id.toString(),
      },
      data: parsedData,
    });
  }
  async findById(id: string): Promise<Work> {
    const results = await this.prisma.work.findUnique({
      where: {
        id,
      },
    });

    return prismaWorkToEntityMapper(results);
  }

  async fetchForWorkersWithHasNewChapterFalse(): Promise<Work[]> {
    const results = await this.prisma.work.findMany({
      where: {
        hasNewChapter: false,
      },
    });

    return results.map(prismaWorkToEntityMapper);
  }

  async createAllWithNotExists(data: Work[]) {
    const operations = data.map((work) => {
      const parsedData = workEntityToPrismaMapper(work);

      this.logger.log(`Syncing document ${work.name} to prisma database category => ${work.name}}`);

      const updateParsedData = omit(parsedData, ['id', 'nextChapterUpdatedAt', 'nextChapter']);

      return this.prisma.work.upsert({
        where: {
          id: work.id.toString(),
          recipientId: parsedData.recipientId,
        },
        create: { ...parsedData, userId: work.userId },
        update: { ...updateParsedData, userId: work.userId, isUpserted: true },
      });
    });
    const results = await this.prisma.$transaction(operations);

    return results.filter((result) => !result.isUpserted).map(prismaWorkToEntityMapper);
  }

  async fetchForWorkersWithHasNewChapterTrue(): Promise<Work[]> {
    const results = await this.prisma.work.findMany({
      where: {
        hasNewChapter: true,
      },
    });

    return results.map(prismaWorkToEntityMapper);
  }

  async findOne(id: string): Promise<Work> {
    const results = await this.prisma.work.findUnique({
      where: {
        id,
      },
    });

    return results ? prismaWorkToEntityMapper(results) : null;
  }

  async fetchForWorksWithHasNewChapterFalseAndWithIsFinishedFalseAndIsDroppedFalse(): Promise<Work[]> {
    const results = await this.prisma.work.findMany({
      where: {
        hasNewChapter: false,
        isFinished: false,
        isDropped: false,
      },
    });

    return results.map(prismaWorkToEntityMapper);
  }

  async findAll() {
    const results = await this.prisma.work.findMany();

    return results.map(prismaWorkToEntityMapper);
  }

  async saveMany(works: Work[]): Promise<void> {
    const operations = works.map((work) => {
      const data = workEntityToPrismaMapper(work);

      delete data.id;

      return this.prisma.work.update({
        where: {
          id: work.id.toString(),
        },
        data,
      });
    });

    await this.prisma.$transaction(operations);
  }

  async fetchWorksScrapingPaginated(
    userId: string,
    page: number,
    filter?: RefreshStatus,
  ): Promise<{ data: Work[]; totalOfPages: number }> {
    const limit = 10;

    console.log({ userId });

    const where = filter ? { refreshStatus: filter, userId } : { userId };

    const [prismaWorks, totalOfPrismaWorks] = await this.prisma.$transaction([
      this.prisma.work.findMany({
        take: limit,
        skip: page * limit,
        orderBy: {
          updatedAt: 'desc',
        },
        where,
      }),

      this.prisma.work.count({
        where,
      }),
    ]);

    return {
      data: map(prismaWorks, prismaWorkToEntityMapper),
      totalOfPages: Math.ceil(totalOfPrismaWorks / limit),
    };
  }

  async fetchAllWorksByUserIdCount(userId: string): Promise<number> {
    return this.prisma.work.count({
      where: {
        userId,
      },
    });
  }
}
