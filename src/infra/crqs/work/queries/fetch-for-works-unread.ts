import { FetchForWorkersUnreadUseCase } from '@domain/work/application/usecases/fetch-for-workrers-unread';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FetchForWorkersUnreadQuery {}

@QueryHandler(FetchForWorkersUnreadQuery)
export class FetchForWorkersUnreadQueryHandler
  implements IQueryHandler<FetchForWorkersUnreadQuery>
{
  constructor(private fetchForWorkersUnread: FetchForWorkersUnreadUseCase) {}

  async execute({}: FetchForWorkersUnreadQuery) {
    const { works } = await this.fetchForWorkersUnread.execute({});

    return works;
  }
}
