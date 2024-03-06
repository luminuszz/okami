import { UpdateUser } from '@domain/auth/application/useCases/update-user';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

interface UpdateUserDto {
  email: string;
  name: string;
}

export class UpdateUserCommand {
  constructor(
    public readonly userId: string,
    public readonly payload: Partial<UpdateUserDto>,
  ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly updateUser: UpdateUser,
    private readonly eventBuss: EventBus,
  ) {}

  async execute({ payload, userId }: UpdateUserCommand): Promise<any> {
    const results = await this.updateUser.execute({
      userId,
      email: payload.email,
      name: payload.name,
    });

    if (results.isRight()) {
      await this.eventBuss.publishAll(results.value.user.events);
    } else {
      throw results.value;
    }
  }
}
