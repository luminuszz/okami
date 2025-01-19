import { ScrappingRefreshStatusRepository } from '@domain/work/application/repositories/scrapping-refresh-status-repository'
import { ScrappingRefreshStatus } from '@domain/work/enterprise/entities/scrapping-refresh-status'
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Injectable()
export class PrismaScrappingRefreshStatusRepository implements ScrappingRefreshStatusRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ScrappingRefreshStatus): Promise<void> {
    await this.prisma.scrappingRefreshStatus.create({
      data: {
        id: data.id,
        createdAt: data.createdAt,
        status: data.status,
        message: data.message,
        workId: data.workId,
      },
    })
  }
}
