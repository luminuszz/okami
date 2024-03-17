import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image';
import { WorkCreatedEvent } from '@domain/work/enterprise/entities/events/work-created';
import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { NotionWorkRepository } from '../notion/notion-work.repository';
import { PrismaWorkRepository } from '../prisma/prisma-work.repository';

@Injectable()
export class BatchService {
  private logger = new Logger(BatchService.name);

  constructor(
    private readonly notionWorkRepository: NotionWorkRepository,
    private readonly prismaWorkRepository: PrismaWorkRepository,
    private readonly uploadWorkImage: UploadWorkImageUseCase,
    private readonly eventBus: EventBus,
  ) {}

  async importNotionDatabaseToMongoDB(databaseId: string, userId: string) {
    try {
      const allNotionData = await this.notionWorkRepository.findAllDocumentWithStatusFollowing(databaseId);

      allNotionData.forEach((work) => {
        work.setUserId(userId);
      });

      const newWorksCreated = await this.prismaWorkRepository.createAllWithNotExists(allNotionData);

      const events = newWorksCreated.map((work) => new WorkCreatedEvent(work));

      this.eventBus.publishAll(events);
    } catch (error) {
      this.logger.error(`Error importing notion database to mongodb ${error}`);
    }
  }

  async setWorkImageFromNotion(databaseId: string) {
    const allNotionData = await this.notionWorkRepository.findAllDocumentWithStatusFollowing(databaseId);

    for (const work of allNotionData) {
      this.logger.debug(`Setting image for work  ${work.name} - ${work.id}`);

      const results = await this.notionWorkRepository.getNotionPageContent(work.recipientId);

      const { image }: any = results.find((item: any) => item.type === 'image');

      const imageUrl = image.type === 'external' ? image.external.url : image.file.url;

      const response = await this.uploadWorkImage.execute({
        imageBuffer: imageUrl,
        workId: work.id,
        fileType: 'png',
      });

      if (response.isLeft()) {
        this.logger.error(`Error setting image for work  ${work.name} - ${work.id}`);
      } else {
        this.logger.log(`Image setted for work  ${work.name} - ${work.id}`);
      }
    }
  }

  async setSyncIdToNotionDatabase() {
    const allWorks = await this.prismaWorkRepository.findAll();

    for (const work of allWorks) {
      await this.notionWorkRepository.setSyncIdInNotionPage(work.recipientId, work.id);
    }
  }
}
