import { WorkMarkUnreadEvent } from '@domain/work/enterprise/entities/events/work-marked-unread';
import { Category } from '@domain/work/enterprise/entities/work';
import { ConfigService } from '@nestjs/config';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateNotificationCommand } from '../commands/createNotification.command';

@EventsHandler(WorkMarkUnreadEvent)
export class WorkMarkUnreadEventHandler
  implements IEventHandler<WorkMarkUnreadEvent>
{
  constructor(
    private commandBus: CommandBus,
    private configService: ConfigService,
  ) {}

  async handle({ payload }: WorkMarkUnreadEvent) {
    let content = '';

    if (payload.category === Category.ANIME) {
      content = `
      ${payload.name} - Episódio Novo disponível !
       link -> ${payload.url}
       `;
    }

    if (payload.category === Category.MANGA) {
      content = `
      ${payload.name} - Capítulo Novo disponível !
       link -> ${payload.url}
       `;
    }

    this.commandBus.execute(
      new CreateNotificationCommand({
        content,
        recipientId: this.configService.get('TELEGRAM_CHAT_ID'),
      }),
    );
  }
}
