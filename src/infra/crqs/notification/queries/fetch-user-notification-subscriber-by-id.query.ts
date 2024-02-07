import { FetchUserNotificationSubscriptionUseCase } from '@domain/notification/application/useCases/fetch-user-notification-subscription-by-userId';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FetchUserNotificationSubscriberByIdQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(FetchUserNotificationSubscriberByIdQuery)
export class FetchUserNotificationSubscriberByIdQueryHandler
  implements IQueryHandler<FetchUserNotificationSubscriberByIdQuery>
{
  constructor(private readonly fetchUserNotificationSubscriberById: FetchUserNotificationSubscriptionUseCase) {}

  async execute({ userId }: FetchUserNotificationSubscriberByIdQuery) {
    const results = await this.fetchUserNotificationSubscriberById.execute({ userId });

    if (results.isRight()) {
      return results.value;
    } else {
      throw results.value;
    }
  }
}
