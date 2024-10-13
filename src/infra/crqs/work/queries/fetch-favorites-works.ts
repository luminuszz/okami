import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { Work } from '@domain/work/enterprise/entities/work';
import { map } from 'lodash';
import { prismaWorkToEntityMapper } from '@infra/database/prisma/prisma-mapper';

export class FetchFavoritesWorksQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(FetchFavoritesWorksQuery)
export class FetchFavoritesWorksQueryHandler implements IQueryHandler<FetchFavoritesWorksQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId }: FetchFavoritesWorksQuery): Promise<Work[]> {
    const works = await this.prisma.work.findMany({
      where: {
        userId,
        isFavorite: true,
      },
    });

    return map(works, prismaWorkToEntityMapper);
  }
}
