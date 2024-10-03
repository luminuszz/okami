import { UserEmailUpdated } from '@domain/auth/enterprise/events/user-email-updated';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateSubscriberEmailByRecipientId } from '@domain/notifications/application/use-cases/update-subscriber-email-by-recipient-id';

@EventsHandler(UserEmailUpdated)
export class OnUserEmailUpdatedHandler implements IEventHandler<UserEmailUpdated> {
  constructor(private readonly updateSubscriberEmail: UpdateSubscriberEmailByRecipientId) {}

  async handle({ payload: user }: UserEmailUpdated) {
    await this.updateSubscriberEmail.execute({
      email: user.email,
      recipientId: user.id,
    });
  }
}
