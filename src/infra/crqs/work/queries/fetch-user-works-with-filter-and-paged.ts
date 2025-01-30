import { prismaWorkToEntityMapper } from '@app/infra/database/prisma/prisma-mapper'
import { PrismaService } from '@app/infra/database/prisma/prisma.service'
import { Status } from '@domain/work/application/usecases/fetch-user-works-with-filter'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { WorkStatus } from '@prisma/client'
import { isEmpty, merge } from 'lodash'

export interface FetchUserWorksWithFilterQueryParams {
  status?: Status
  search?: string
  page: number
  limit: 10 | 20 | 30
}

export class FetchUserWorksWithFilterAndPagedQuery {
  constructor(
    public readonly userId: string,
    public readonly searchParams: FetchUserWorksWithFilterQueryParams,
  ) {}
}

@QueryHandler(FetchUserWorksWithFilterAndPagedQuery)
export class FetchUserWorksWithFilterAndPagedQueryHandler
  implements IQueryHandler<FetchUserWorksWithFilterAndPagedQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ searchParams, userId }: FetchUserWorksWithFilterAndPagedQuery) {
    const { limit, page, search, status } = searchParams

    const query = {
      take: limit,
      skip: (page - 1) * limit,
      where: {
        userId,
      },
      include: {
        tags: true,
      },
      orderBy: {},
    }

    if (status) {
      if (status === 'favorites') {
        merge(query.where, { isFavorite: true })
        merge(query.orderBy, { createdAt: 'desc' })
      } else {
        const parserFilterStatus = {
          unread: WorkStatus.UNREAD,
          read: WorkStatus.READ,
          finished: WorkStatus.FINISHED,
          dropped: WorkStatus.DROPPED,
        }

        const currentStatus = parserFilterStatus[status]

        merge(query.where, { status: currentStatus })
        merge(query.orderBy, currentStatus === 'UNREAD' ? { nextChapterUpdatedAt: 'desc' } : { updatedAt: 'desc' })
      }
    }

    if (search) {
      merge(query.where, {
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

    if (isEmpty(query.orderBy)) {
      merge(query.orderBy, { createdAt: 'desc' })
    }

    const [results, totalOfWorks] = await this.prisma.$transaction([
      this.prisma.work.findMany(query as any),
      this.prisma.work.count({
        where: query.where,
      }),
    ])

    return {
      works: results.map(prismaWorkToEntityMapper),
      totalOfPages: Math.ceil(totalOfWorks / limit),
      nextPage: page >= totalOfWorks / limit ? null : page + 1,
    }
  }
}
