import { prismaWorkToEntityMapper } from '@app/infra/database/prisma/prisma-mapper'
import { PrismaService } from '@app/infra/database/prisma/prisma.service'
import { RefreshStatus, WorkStatus } from '@domain/work/enterprise/entities/work'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { map, merge } from 'lodash'

export class FetchWorksScrapingPaginatedReportQuery {
  constructor(
    public readonly page: number,
    public readonly userId: string,
    public readonly filter?: RefreshStatus,
    public readonly search?: string,
  ) {}
}

@QueryHandler(FetchWorksScrapingPaginatedReportQuery)
export class FetchWorksScrapingPaginatedReportQueryHandler
  implements IQueryHandler<FetchWorksScrapingPaginatedReportQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ page, filter, userId, search }: FetchWorksScrapingPaginatedReportQuery) {
    const limit = 10

    const where = {
      userId,
      OR: [{ status: WorkStatus.UNREAD }, { status: WorkStatus.READ }],
      refreshStatus: {
        not: null,
      },
    }

    if (filter) {
      Object.assign(where, { refreshStatus: filter })
    }

    if (search) {
      Object.assign(where, {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            alternativeName: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      })
    }

    const [prismaWorks, totalOfPrismaWorks] = await this.prisma.$transaction([
      this.prisma.work.findMany({
        take: limit,
        skip: page * limit,
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          ScrappingRefreshStatus: {
            select: {
              message: true,
            },

            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        where,
      }),

      this.prisma.work.count({
        where,
      }),
    ])

    const data = map(prismaWorks, (prismaWork) => {
      return merge(prismaWorkToEntityMapper(prismaWork), {
        message: prismaWork?.ScrappingRefreshStatus?.[0]?.message ?? null,
      })
    })

    return {
      data,
      totalOfPages: Math.ceil(totalOfPrismaWorks / limit),
    }
  }
}
