import { WorkRepository } from '@domain/work/application/repositories/work-repository';
import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { NotionPage } from './dto/notion-page.dto';
import { NotionApiAdapter } from './notion-api-adapter.provider';
import { NotionMapper } from './notion.mappter';

@Injectable()
export class NotionWorkRepository implements WorkRepository {
  constructor(private readonly notion: NotionApiAdapter) {}

  private getUpdateMessage = () => ({
    rich_text: [
      {
        type: 'text',
        text: {
          content: `updated by Okami integration ${new Date().toLocaleString()} `,
        },
      },
    ],
  });

  async create(work: Work): Promise<void> {
    await this.notion.pages.create({
      parent: {
        database_id: this.notion.database_id,
      },
      properties: { ...work, Notas: this.getUpdateMessage() } as any,
    });
  }

  async save(work: Work): Promise<void> {
    await this.notion.pages.update({
      page_id: work.id,
      properties: { ...work, Notas: this.getUpdateMessage() } as any,
    });
  }

  fetchForWorkersWithHasNewChapterFalse(): Promise<Work[]> {
    throw new Error('Method not implemented.');
  }

  public async updateForNewChapter(id: string): Promise<void> {
    await this.notion.pages.update({
      page_id: id,
      properties: {
        'CAPITULO NOVO': {
          checkbox: true,
        },

        Notas: this.getUpdateMessage() as any,
      },
    });
  }

  public async updateForNewChapterFalse(id: string, chapter: number): Promise<void> {
    await this.notion.pages.update({
      page_id: id,
      properties: {
        'CAPITULO NOVO': {
          checkbox: false,
        },
        cap: {
          number: chapter,
        },

        Notas: this.getUpdateMessage() as any,
      },
    });
  }

  findById(): Promise<Work> {
    throw new Error('Method not implemented.');
  }

  async findaAllDocuments(): Promise<Work[]> {
    const response = await this.notion.databases.query({
      database_id: this.notion.database_id,
      filter: {
        property: 'Name',
        title: {
          is_not_empty: true,
        },
      },
    });

    return response.results.map((item) => NotionMapper.toDomain(item as NotionPage));
  }

  async findAllDocumentWithStatusFollowing(): Promise<Work[]> {
    const response = await this.notion.databases.query({
      database_id: this.notion.database_id,
      filter: {
        and: [
          {
            property: 'status',
            select: {
              equals: 'Acompanhando',
            },
          },
        ],
      },
    });

    return response.results.map((item) => NotionMapper.toDomain(item as NotionPage));
  }

  async fetchForWorkersWithHasNewChapterTrue(): Promise<Work[]> {
    const { results } = await this.notion.databases.query({
      database_id: this.notion.database_id,
      filter: {
        property: 'CAPITULO NOVO',
        checkbox: {
          equals: true,
        },
      },
    });

    return results.map((item) => NotionMapper.toDomain(item as NotionPage));
  }

  async findOne(id: string): Promise<Work> {
    const response = await this.notion.pages.retrieve({
      page_id: id,
    });

    return NotionMapper.toDomain(response as NotionPage);
  }

  async moveWorkToFinishedStatus(id: string): Promise<void> {
    await this.notion.pages.update({
      page_id: id,
      properties: {
        status: {
          select: {
            name: 'Finalizado',
          },
        },
      },
    });
  }

  async fetchForWorksWithHasNewChapterFalseAndWithIsFinishedFalse(): Promise<Work[]> {
    const { results } = await this.notion.databases.query({
      database_id: this.notion.database_id,
      filter: {
        and: [
          {
            property: 'status',
            select: {
              does_not_equal: 'Finalizado',
            },
          },

          {
            property: 'CAPITULO NOVO',
            checkbox: {
              equals: false,
            },
          },
        ],
      },
    });

    return results.map((item) => NotionMapper.toDomain(item as NotionPage));
  }
}
