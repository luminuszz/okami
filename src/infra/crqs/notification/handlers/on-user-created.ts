import { UserCreated } from '@domain/auth/application/events/user-created';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';

@EventsHandler(UserCreated)
export class OnUserCreatedEventHandler implements IEventHandler<UserCreated> {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationService: ClientProxy,
  ) {}

  async handle({ payload }: UserCreated) {
    this.notificationService.emit('new-subscriber', {
      recipientId: payload.id,
    });
  }
}
