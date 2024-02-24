import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WorkRefreshStatusUpdatedEvent } from '@domain/work/enterprise/entities/events/work-refresh-status-updated';
import { Category, RefreshStatus } from '@domain/work/enterprise/entities/work';
import { CreateNotificationCommand } from '@infra/crqs/notification/commands/createNotification.command';
import { EnvService } from '@app/infra/env/env.service';

@EventsHandler(WorkRefreshStatusUpdatedEvent)
export class WorkRefreshStatusEventHandler implements IEventHandler<WorkRefreshStatusUpdatedEvent> {
  constructor(
    private commandBus: CommandBus,
    private env: EnvService,
  ) {}

  async handle({ payload }: WorkRefreshStatusUpdatedEvent) {
    if (payload.refreshStatus === RefreshStatus.FAILED) {
      const content = `
     Erro - ${payload.name} - ${payload.refreshStatus}  !
     Erro ao buscar novos ${payload.category === Category.ANIME ? 'episódios' : 'capítulos'} de ${payload.name} !`;
      payload.imageId = '';

      await this.commandBus.execute(
        new CreateNotificationCommand(
          { content, workId: payload.id, recipientId: this.env.get('TELEGRAM_CHAT_ID') },
          payload,
        ),
      );
    }
  }
}
