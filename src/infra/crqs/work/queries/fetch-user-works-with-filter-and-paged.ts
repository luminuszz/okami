import { prismaWorkToEntityMapper } from '@app/infra/database/prisma/prisma-mapper';
import { PrismaService } from '@app/infra/database/prisma/prisma.service';
import { Status } from '@domain/work/application/usecases/fetch-user-works-with-filter';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WorkStatus } from '@prisma/client';
import { merge } from 'lodash';

export interface FetchUserWorksWithFilterQueryParams {
  status?: Status;
  search?: string;
  page: number;
  limit: 10 | 20 | 30;
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
    const { limit, page, search, status } = searchParams;

    const query = {
      userId,
    };

    if (status) {
      if (status === 'favorites') {
        merge(query, { isFavorite: true });
      } else {
        const parserFilterStatus = {
          unread: WorkStatus.UNREAD,
          read: WorkStatus.READ,
          finished: WorkStatus.FINISHED,
          dropped: WorkStatus.DROPPED,
        };

        merge(query, { status: parserFilterStatus[status] });
      }
    }

    if (search) {
      merge(query, {
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
      });
    }

    const [results, totalOfWorks] = await this.prisma.$transaction([
      this.prisma.work.findMany({
        where: query,
        orderBy: {
          createdAt: 'desc',
        },
        skip: page * limit,
        take: limit,
        include: {
          tags: true,
        },
      }),
      this.prisma.work.count({
        where: query,
      }),
    ]);

    return {
      works: results.map(prismaWorkToEntityMapper),
      totalOfPages: Math.ceil(totalOfWorks / limit),
    };
  }
}
