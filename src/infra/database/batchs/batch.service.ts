import { Injectable, Logger } from '@nestjs/common';
import { NotionWorkRepository } from '../notion/notion-work.repository';
import { PrismaWorkRepository } from '../prisma/prisma-work.repository';
import { QueueProvider } from '@domain/work/application/contracts/queueProvider';
import { QueueMessage } from '@domain/work/application/queue/Queue';
import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image';
import { EventBus } from '@nestjs/cqrs';
import { WorkCreatedEvent } from '@domain/work/enterprise/entities/events/work-created';
import { Tag } from '@domain/work/enterprise/entities/tag';
import { Slug } from '@domain/work/enterprise/entities/values-objects/slug';
import { PrismaTagRepository } from '../prisma/prisma-tag.repository';

interface SyncNotionDatabaseBatchProps {
  database_id: string;
  user_id: string;
}

@Injectable()
export class BatchService {
  private logger = new Logger(BatchService.name);

  constructor(
    private readonly notionWorkRepository: NotionWorkRepository,
    private readonly prismaWorkRepository: PrismaWorkRepository,
    private readonly queueProvider: QueueProvider,
    private readonly uploadWorkImage: UploadWorkImageUseCase,
    private readonly eventBus: EventBus,
    private readonly prismaTagRepository: PrismaTagRepository,
  ) {
    this.queueProvider.subscribe(
      QueueMessage.SYNC_WITH_OTHER_DATABASES,
      ({ database_id, user_id }: SyncNotionDatabaseBatchProps) => {
        if (database_id) {
          void this.importNotionDatabaseToMongoDB(database_id, user_id);
        }
      },
    );
  }

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

  async setAllTagsFromNotionDatabase(database_id: string) {
    const response = await this.notionWorkRepository.fetchAllNotionWorksTags(database_id);

    const data = response.map((item) => ({
      workId: item.id,
      tags: item.tags.map((tag) => Tag.create({ name: tag.name, slug: new Slug(tag.name), color: tag.color })),
    }));

    await this.prismaWorkRepository.linkTagsBatch(data);
  }

  async updateTagColorFromNotionDatabase(database_id: string) {
    const response = await this.notionWorkRepository.fetchAllNotionWorksTags(database_id);

    const tags = response
      .flatMap((item) => item.tags)
      .map((notionTag) => Tag.create({ name: notionTag.name, slug: new Slug(notionTag.name), color: notionTag.color }));

    await this.prismaTagRepository.updateTagColorBatch(tags);
  }
}
