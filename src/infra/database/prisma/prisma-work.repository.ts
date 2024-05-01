import { FetchUserWorksInput, WorkRepository } from '@domain/work/application/repositories/work-repository';
import { Tag } from '@domain/work/enterprise/entities/tag';
import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable, Logger } from '@nestjs/common';
import { RefreshStatus, WorkStatus } from '@prisma/client';
import { map } from 'lodash';
import { prismaWorkToEntityMapper, workEntityToPrismaMapper } from './prisma-mapper';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaWorkRepository implements WorkRepository {
  private logger = new Logger(PrismaWorkRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async fetchWorksByUserIdWithFilters({ userId, status }: FetchUserWorksInput): Promise<Work[]> {
    const parserFilter = {
      unread: WorkStatus.UNREAD,
      read: WorkStatus.READ,
      finished: WorkStatus.FINISHED,
      dropped: WorkStatus.DROPPED,
    };

    const filter = parserFilter[status];

    const results = await this.prisma.work.findMany({
      where: {
        status: filter,
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        tags: true,
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

    return results ? prismaWorkToEntityMapper(results) : null;
  }

  async fetchForWorkersWithHasNewChapterFalse(): Promise<Work[]> {
    const results = await this.prisma.work.findMany({
      where: {
        status: WorkStatus.READ,
      },
    });

    return results.map(prismaWorkToEntityMapper);
  }

  async createAllWithNotExists(data: Work[]) {
    const operations = data.map((work) => {
      this.logger.log(`Syncing document ${work.name} to prisma database category => ${work.name}}`);

      const parsedData = workEntityToPrismaMapper(work);

      const updateParsedData = {
        name: work.name,
        chapters: work.chapter.getChapter(),
        category: work.category,
        url: work.url,
        userId: work.userId,
        isUpserted: true,
      };

      return this.prisma.work.upsert({
        where: {
          id: work.id.toString(),
          recipientId: parsedData.recipientId,
        },
        create: parsedData,
        update: updateParsedData,
      });
    });
    const results = await this.prisma.$transaction(operations);

    return results.filter((result) => !result.isUpserted).map(prismaWorkToEntityMapper);
  }

  async fetchForWorkersWithHasNewChapterTrue(): Promise<Work[]> {
    const results = await this.prisma.work.findMany({
      where: {
        status: WorkStatus.UNREAD,
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
        status: WorkStatus.READ,
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

    const where = {
      userId,
      OR: [{ status: WorkStatus.UNREAD }, { status: WorkStatus.READ }],
      refreshStatus: {
        not: null,
      },
    };

    if (filter) {
      Object.assign(where, { refreshStatus: filter });
    }

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

  async deleteWork(workId: string): Promise<void> {
    await this.prisma.work.delete({
      where: {
        id: workId,
      },
    });
  }

  async fetchAllWorksByUserIdAndHasNewChapterFalse(userId: string): Promise<Work[]> {
    const results = await this.prisma.work.findMany({
      where: {
        userId,
        status: WorkStatus.READ,
      },
    });

    return results.map(prismaWorkToEntityMapper);
  }

  async findUserWorkById(userId: string, workId: string): Promise<Work> {
    const results = await this.prisma.work.findUnique({
      where: {
        id: workId,
        userId,
      },
    });

    return results ? prismaWorkToEntityMapper(results) : null;
  }

  async linkTagsBatch(payload: { workId: string; tags: Tag[] }[]): Promise<void> {
    try {
      const operations = payload.map((data) => {
        this.logger.log(`Linking tags to work ${data.workId} with tags ${data.tags.map((tag) => tag.name).join(', ')}`);

        return this.prisma.work.update({
          where: {
            recipientId: data.workId,
          },
          data: {
            tags: {
              connectOrCreate: data.tags.map((tag) => ({
                where: {
                  slug: tag.slug,
                },
                create: {
                  name: tag.name,
                  slug: tag.slug,
                  createdAt: tag.createdAt,
                  id: tag.id,
                  updatedAt: tag.updatedAt,
                  color: tag.color,
                },
              })),
            },
          },
        });
      });

      await this.prisma.$transaction(operations);
    } catch (error) {
      this.logger.error(`Error linking tags to work ${error}`);
    }
  }
}
