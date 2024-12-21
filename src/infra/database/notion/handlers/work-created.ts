import { UpdateWorkUseCase } from '@domain/work/application/usecases/update-work';
import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image';
import { WorkCreatedEvent } from '@domain/work/enterprise/entities/events/work-created';
import { NotionImageObject } from '@infra/database/notion/dto/notion-image.dto';
import { NotionWorkRepository } from '@infra/database/notion/notion-work.repository';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotionMapper } from '../notion.mappter';

@EventsHandler(WorkCreatedEvent)
export class SetSyncIdOnNotionPageEventHandler implements IEventHandler<WorkCreatedEvent> {
  constructor(private notionRepository: NotionWorkRepository) {}

  async handle({ payload }: WorkCreatedEvent) {
    if (!payload.recipientId) return;

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
    if (!payload.recipientId) return;

    const notionPageDetails = await this.notionRepository.getNotionPageContent(payload.recipientId);

    const results = (notionPageDetails.find((item: any) => item.type === 'image') as NotionImageObject) || null;

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

@EventsHandler(WorkCreatedEvent)
export class ExtractDescriptionFormNotionEventHandler implements IEventHandler<WorkCreatedEvent> {
  constructor(
    private notionRepository: NotionWorkRepository,
    private updateWork: UpdateWorkUseCase,
  ) {}

  async handle({ payload }: WorkCreatedEvent) {
    const { userId, id, recipientId } = payload;

    const notionPageContent = await this.notionRepository.getNotionPageContent(recipientId);

    if (!notionPageContent) return;

    const description = NotionMapper.extractDescriptionFromNotionPage(notionPageContent);

    if (!description) {
      throw new Error('Description not found');
    }

    const results = await this.updateWork.execute({
      data: {
        description,
      },
      id,
      userId,
    });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
