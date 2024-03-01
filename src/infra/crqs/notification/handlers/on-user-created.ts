import { MessageService } from '@app/infra/messaging/messaging-service';
import { UserCreated } from '@domain/auth/application/events/user-created';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(UserCreated)
export class OnUserCreatedEventHandler implements IEventHandler<UserCreated> {
  constructor(private readonly notificationService: MessageService) {}

  async handle({ payload }: UserCreated) {
    this.notificationService.emit('new-subscriber', {
      recipientId: payload.id,
      email: payload.email,
    });
  }
}
