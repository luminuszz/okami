import { CreateNotificationUseCase } from '@domain/notification/application/useCases/create-notification';
import { NotificationCreatedEvent } from '@domain/notification/enterprise/events/notificationCreated';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Work } from '@domain/work/enterprise/entities/work';

interface CreateNotificationCommandPayload {
  content: string;
  recipientId: string;
  workId: string;
}

export class CreateNotificationCommand {
  constructor(public payload: CreateNotificationCommandPayload, public readonly work: Work) {}
}

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationCommandHandler implements ICommandHandler<CreateNotificationCommand> {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ payload, work }: CreateNotificationCommand): Promise<void> {
    const results = await this.createNotificationUseCase.execute({
      content: payload.content,
      recipientId: payload.recipientId,
      workId: payload.workId,
    });

    if (results.isRight()) {
      await this.eventBus.publish(new NotificationCreatedEvent(results.value.notification, work));
    }
  }
}
