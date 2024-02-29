import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { UserCreated } from '@domain/auth/application/events/user-created';

interface Payload {
  name: string;
  email: string;
  password: string;
}

export class CreateUserCommand {
  constructor(public readonly payload: Payload) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private eventBus: EventBus,
  ) {}
  async execute({ payload }: CreateUserCommand): Promise<void> {
    const results = await this.createUser.execute(payload);

    if (results.isLeft()) {
      throw results.value;
    }

    this.eventBus.publish(new UserCreated(results.value.user));
  }
}
