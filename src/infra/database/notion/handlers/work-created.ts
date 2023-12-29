import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WorkCreatedEvent } from '@domain/work/enterprise/entities/events/work-created';
import { NotionWorkRepository } from '@infra/database/notion/notion-work.repository';
import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image';

@EventsHandler(WorkCreatedEvent)
export class SetSyncIdOnNotionPageEventHandler implements IEventHandler<WorkCreatedEvent> {
  constructor(private notionRepository: NotionWorkRepository) {}

  async handle({ payload }: WorkCreatedEvent) {
    await this.notionRepository.setSyncIdInNotionPage(payload.recipientId, payload.id);
  }
}

@EventsHandler(WorkCreatedEvent)
export class UploadNotionWorkImageFromNotionEventHandler implements IEventHandler<WorkCreatedEvent> {
  constructor(
    private notionRepository: NotionWorkRepository,
    private uploadWorkImage: UploadWorkImageUseCase,
  ) {}

  async handle({ payload }: WorkCreatedEvent) {
    const notionPageDetails = await this.notionRepository.getNotionPageContent(payload.recipientId);

    const results: any = notionPageDetails.find((item: any) => item.type === 'image') || null;

    if (results) {
      const { image } = results;

      const imageUrl = image.type === 'external' ? image.external.url : image.file.url;

      const response = await this.uploadWorkImage.execute({
        imageBuffer: imageUrl,
        workId: payload.id,
        fileType: 'png',
      });

      if (response.isLeft()) {
        throw response.value;
      }
    }
  }
}