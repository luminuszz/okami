import { CreateNotificationUseCase } from '@domain/notification/application/use-cases/create-notification';
import { NotificationCreatedEvent } from '@domain/notification/enterprise/events/notificationCreated';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

interface CreateNotificationCommandPayload {
  content: string;
  recipientId: string;
}

export class CreateNotificationCommand {
  constructor(public payload: CreateNotificationCommandPayload) {}
}

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationCommandHandler
  implements ICommandHandler<CreateNotificationCommand>
{
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ payload }: CreateNotificationCommand): Promise<void> {
    const { notification } = await this.createNotificationUseCase.execute({
      content: payload.content,
      recipientId: payload.recipientId,
    });

    await this.eventBus.publish(new NotificationCreatedEvent(notification));
  }
}
