import { WorkRepository } from '@domain/work/application/repositories/work-repository';
import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable, Logger } from '@nestjs/common';
import { omit } from 'lodash';
import { prismaWorkToEntityMapper, workEntityToPrismaMapper } from './prisma-mapper';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaWorkRepository implements WorkRepository {
  private logger = new Logger(PrismaWorkRepository.name);

  constructor(private readonly prisma: PrismaService) {}

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
          recipientId: work.recipientId,
        },
        create: { ...parsedData, userId: '658226ff35d5c694026fa4f5' },
        update: { ...updateParsedData, userId: '658226ff35d5c694026fa4f5', isUpserted: true },
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

  async fetchForWorksWithHasNewChapterFalseAndWithIsFinishedFalse(): Promise<Work[]> {
    const results = await this.prisma.work.findMany({
      where: {
        hasNewChapter: false,
        isFinished: false,
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

  async fetchWorksScrapingPaginated(page: number): Promise<{ data: Work[]; totalOfPages: number }> {
    const totalOfWorks = await this.prisma.work.count();

    const limit = 10;

    const results = await this.prisma.work.findMany({
      take: limit,
      skip: page * limit,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return {
      data: results.map(prismaWorkToEntityMapper),
      totalOfPages: Math.ceil(totalOfWorks / limit),
    };
  }
}
