import { DecreaseTrialUserWorkLimit } from '@domain/auth/application/useCases/decrease-trial-user-work-limit';
import { WorkCreatedEvent } from '@domain/work/enterprise/entities/events/work-created';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(WorkCreatedEvent)
export class OnWorkUserCreatedHandler implements IEventHandler<WorkCreatedEvent> {
  constructor(private readonly decreaseTrialUserWorkLimit: DecreaseTrialUserWorkLimit) {}

  async handle(event: WorkCreatedEvent) {
    const work = event.payload;

    await this.decreaseTrialUserWorkLimit.execute({ userId: work.userId });
  }
}
