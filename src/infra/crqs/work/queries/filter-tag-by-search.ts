import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { map } from 'lodash';
import { prismaTagToEntityTag } from '@infra/database/prisma/prisma-mapper';
import { Tag } from '@domain/work/enterprise/entities/tag';

export class FilterTagBySearchQuery {
  constructor(public readonly search: string) {}
}

@QueryHandler(FilterTagBySearchQuery)
export class FilterTagBySearchQueryHandler implements IQueryHandler<FilterTagBySearchQuery, Tag[]> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ search }: FilterTagBySearchQuery) {
    const results = await this.prisma.tag.findMany({
      where: {
        slug: {
          contains: search,
        },
      },
    });

    return map(results, prismaTagToEntityTag);
  }
}
