import { WorkMarkUnreadEvent } from '@domain/work/enterprise/entities/events/work-marked-unread';
import { Category } from '@domain/work/enterprise/entities/work';
import { ConfigService } from '@nestjs/config';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateNotificationCommand } from '../commands/createNotification.command';

@EventsHandler(WorkMarkUnreadEvent)
export class NotificationWorkMarkUnreadEventHandler implements IEventHandler<WorkMarkUnreadEvent> {
  constructor(private commandBus: CommandBus, private configService: ConfigService) {}

  async handle({ payload }: WorkMarkUnreadEvent) {
    const content =
      payload.category === Category.ANIME
        ? `${payload.name} - Episódio Novo disponível !`
        : `${payload.name} - Capítulo Novo disponível !`;

    await this.commandBus.execute(
      new CreateNotificationCommand(
        {
          content,
          recipientId: this.configService.get('TELEGRAM_CHAT_ID'),
          workId: payload.id,
        },
        payload,
      ),
    );
  }
}
