import { Injectable } from '@nestjs/common';
import { NotionWorkRepository } from '../notion/notion-work.repository';
import { PrismaWorkRepository } from '../prisma/prisma-work.repository';

@Injectable()
export class BatchService {
  constructor(
    private readonly notionWorkRepository: NotionWorkRepository,
    private readonly prismaWorkRepository: PrismaWorkRepository,
  ) {}

  async importNotionDatabaseToMongoDB() {
    const allNotionData =
      await this.notionWorkRepository.findAllDocumentWithStatusFollowing();

    await this.prismaWorkRepository.createAllWithNotExists(allNotionData);
  }
}
