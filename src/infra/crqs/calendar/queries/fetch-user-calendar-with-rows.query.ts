import { PrismaService } from '@infra/database/prisma/prisma.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FetchUserCalendarWithRowsQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(FetchUserCalendarWithRowsQuery)
export class FetchUserCalendarWithRowsQueryHandler implements IQueryHandler<FetchUserCalendarWithRowsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: FetchUserCalendarWithRowsQuery) {
    return this.prisma.calendar.findUnique({
      where: {
        userId: query.userId,
      },
      include: {
        rows: {
          select: {
            Work: {
              select: {
                name: true,
                description: true,
                id: true,
                status: true,
                nextChapter: true,
                chapters: true,
                imageId: true,
              },
            },
            createdAt: true,
            dayOfWeek: true,
            id: true,
          },
        },
      },
    });
  }
}
