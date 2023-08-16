import { Injectable } from '@nestjs/common';
import { NotionWorkRepository } from '../notion/notion-work.repository';
import { PrismaWorkRepository } from '../prisma/prisma-work.repository';
import { QueueProvider } from '@domain/work/application/contracts/queueProvider';
import { QueueMessage } from '@domain/work/application/queue/Queue';

@Injectable()
export class BatchService {
  constructor(
    private readonly notionWorkRepository: NotionWorkRepository,
    private readonly prismaWorkRepository: PrismaWorkRepository,
    private readonly queueProvider: QueueProvider,
  ) {
    this.queueProvider.subscribe(QueueMessage.SYNC_WITH_OTHER_DATABASES, () => this.importNotionDatabaseToMongoDB());
  }

  async importNotionDatabaseToMongoDB() {
    const allNotionData = await this.notionWorkRepository.findAllDocumentWithStatusFollowing();

    await this.prismaWorkRepository.createAllWithNotExists(allNotionData);
  }
}
