import { MessageService } from '@app/infra/messaging/messaging-service';
import { UserEmailUpdated } from '@domain/auth/enterprise/events/user-email-updated';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(UserEmailUpdated)
export class OnUserEmailUpdatedHandler implements IEventHandler<UserEmailUpdated> {
  constructor(private readonly notificationService: MessageService) {}

  async handle({ payload: user }: UserEmailUpdated) {
    this.notificationService.emit('subscriber-email-updated', {
      recipientId: user.id,
      email: user.email,
    });
  }
}
