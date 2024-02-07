import { CreateUserNotificationSubscriptionUseCase } from '@domain/notification/application/useCases/create-user-notification-subscription';
import { NotificationType } from '@domain/notification/enterprise/entities/user-notification-subscription';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

interface Payload {
  userId: string;
  subscriptionId: string;
  credentials: {
    endpoint: string;
    keys: {
      auth: string;
      p256dh: string;
    };
  };
}

export class CreateBrowserUserNotificationSubscriptionCommand {
  constructor(public readonly payload: Payload) {}
}

@CommandHandler(CreateBrowserUserNotificationSubscriptionCommand)
export class CreateBrowserUserNotificationSubscriptionCommandHandler
  implements ICommandHandler<CreateBrowserUserNotificationSubscriptionCommand>
{
  constructor(
    private readonly createUserNotificationSubscription: CreateUserNotificationSubscriptionUseCase,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ payload }: CreateBrowserUserNotificationSubscriptionCommand) {
    const results = await this.createUserNotificationSubscription.execute({
      notificationType: NotificationType.BROWSER,
      subscriptionId: payload.subscriptionId,
      userId: payload.userId,
      credentials: payload.credentials,
    });

    if (results.isRight()) {
      this.eventBus.publishAll(results.value.events);
    }
  }
}
