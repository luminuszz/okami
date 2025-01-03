import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateSubscriber } from '@domain/notifications/application/use-cases/create-subscriber';
import { UserCreated } from '@domain/auth/enterprise/events/user-created';

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
