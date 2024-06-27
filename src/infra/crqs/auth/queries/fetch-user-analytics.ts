import { FetchUserAnalytics } from '@domain/auth/application/useCases/fetch-user-analytics';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FetchUserAnalyticsQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(FetchUserAnalyticsQuery)
export class FetchUserAnalyticsQueryHandler implements IQueryHandler<FetchUserAnalyticsQuery> {
  constructor(private readonly fetchUserAnalytics: FetchUserAnalytics) {}

  async execute({ userId }: FetchUserAnalyticsQuery) {
    const response = await this.fetchUserAnalytics.execute({ userId });

    if (response.isLeft()) {
      throw response.value;
    }

    return response.value;
  }
}
