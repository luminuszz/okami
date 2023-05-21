import { WorkRepository } from '@domain/work/application/repositories/work-repository';
import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import {
  prismaWorkToEntityMapper,
  workEntityToPrismaMapper,
} from './prisma-mapper';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaWorkRepository implements WorkRepository {
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
}
