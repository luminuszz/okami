import { UserCreated } from '@domain/auth/enterprise/events/user-created'
import { CreateCalendar } from '@domain/calendar/application/useCases/create-calendar'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

@EventsHandler(UserCreated)
export class CreateCalendarOnNewUserHandler implements IEventHandler<UserCreated> {
  constructor(private createCalendar: CreateCalendar) {}

  async handle({ payload: user }: UserCreated) {
    const results = await this.createCalendar.execute({
      title: `${user.name}'s calendar`,
      description: `${user.name}'s calendar`,
      userId: user.id,
    })

    if (results.isLeft()) {
      throw results.value
    }
  }
}
