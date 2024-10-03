import { UserCreated } from '@domain/auth/application/events/user-created';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateSubscriber } from '@domain/notifications/application/use-cases/create-subscriber';

@EventsHandler(UserCreated)
export class OnUserCreatedEventHandler implements IEventHandler<UserCreated> {
  constructor(private readonly createSubscriber: CreateSubscriber) {}

  async handle({ payload }: UserCreated) {
    await this.createSubscriber.execute({
      recipientId: payload.id,
      email: payload.email,
    });
  }
}
