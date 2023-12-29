import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WorkRefreshStatusUpdatedEvent } from '@domain/work/enterprise/entities/events/work-refresh-status-updated';
import { Category, RefreshStatus } from '@domain/work/enterprise/entities/work';
import { ConfigService } from '@nestjs/config';
import { CreateNotificationCommand } from '@infra/crqs/notification/commands/createNotification.command';

@EventsHandler(WorkRefreshStatusUpdatedEvent)
export class WorkRefreshStatusEventHandler implements IEventHandler<WorkRefreshStatusUpdatedEvent> {
  constructor(
    private commandBus: CommandBus,
    private configService: ConfigService,
  ) {}

  async handle({ payload }: WorkRefreshStatusUpdatedEvent) {
    if (payload.refreshStatus === RefreshStatus.FAILED) {
      const content = `
     Erro - ${payload.name} - ${payload.refreshStatus}  !
     Erro ao buscar novos ${payload.category === Category.ANIME ? 'episódios' : 'capítulos'} de ${payload.name} !`;
      payload.imageId = '';

      await this.commandBus.execute(
        new CreateNotificationCommand(
          { content, workId: payload.id, recipientId: this.configService.get('TELEGRAM_CHAT_ID') },
          payload,
        ),
      );
    }
  }
}
