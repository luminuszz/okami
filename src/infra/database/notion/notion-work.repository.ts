import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { NotionPage } from './dto/notion-page.dto';
import { NotionMapper } from './notion.mappter';
import { NotionService } from './notion.service';
import { CloudFlareR2StorageAdapter } from '@app/infra/storage/cloudFlare-r2-storage.adapter';

@Injectable()
export class NotionWorkRepository {
  constructor(private readonly notion: NotionService) {}

  private getUpdateMessage = (created?: boolean) => ({
    rich_text: [
      {
        type: 'text',
        text: {
          content: `${created ? 'Created' : 'Updated'}  by Okami integration ${new Date().toLocaleString()} `,
        },
      },
    ],
  });

  private readonly newChapterToken = 'CAPITULO NOVO';

  async create(work: Work, database_id: string): Promise<{ pageId: string }> {
    const response = await this.notion.pages.create({
      parent: {
        type: 'database_id',
        database_id,
      },
      properties: {
        title: [
          {
            type: 'text',
            text: {
              content: work.name,
            },
          },
        ],
        URL: { type: 'url', url: work.url },
        cap: { type: 'number', number: work.chapter.getChapter() },

        status: {
          type: 'select',
          select: {
            name: 'Acompanhando',
          },
        },
      } as any,

      content: [
        {
          type: 'image',
          image: {
            external: {
              url: CloudFlareR2StorageAdapter.createS3FileUrl(`${work.id}-${work.imageId}`),
            },
          },
        },
      ],
    });

    return {
      pageId: response.id,
    };
  }

  async save(work: Work): Promise<void> {
    const notionWork = NotionMapper.toNotion(work);

    await this.notion.pages.update({
      page_id: work.recipientId,
      properties: {
        title: [
          {
            type: 'text',
            text: {
              content: notionWork.Name,
            },
          },
        ],
        cap: notionWork.cap,
        URL: notionWork.URL,
      },
    });
  }

  fetchForWorkersWithHasNewChapterFalse(): Promise<Work[]> {
    throw new Error('Method not implemented.');
  }

  public async updateForNewChapter(id: string): Promise<void> {
    await this.notion.pages.update({
      page_id: id,
      properties: {
        [this.newChapterToken]: {
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
        [this.newChapterToken]: {
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

  async findaAllDocuments(database_id: string): Promise<Work[]> {
    const response = await this.notion.databases.query({
      database_id: database_id,
      filter: {
        property: 'Name',
        title: {
          is_not_empty: true,
        },
      },
    });

    return response.results.map((item) => NotionMapper.toDomain(item as NotionPage));
  }

  async findAllDocumentWithStatusFollowing(database_id: string): Promise<Work[]> {
    const response = await this.notion.databases.query({
      database_id,
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

  async fetchAllNotionWorksTags(database_id: string) {
    const response = await this.notion.databases.query({
      database_id,
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

    return response.results.map((item: any) => ({
      id: item.id,
      tags: item.properties['Gêneros']?.multi_select,
    }));
  }

  async fetchForWorkersWithHasNewChapterTrue(database_id: string): Promise<Work[]> {
    const { results } = await this.notion.databases.query({
      database_id,
      filter: {
        property: this.newChapterToken,
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

  async moveWorkToArchive(id: string): Promise<void> {
    await this.notion.pages.update({
      page_id: id,
      properties: {
        status: {
          select: {
            name: 'Lerei',
          },
        },
      },
    });
  }

  async fetchForWorksWithHasNewChapterFalseAndWithIsFinishedFalse(database_id: string): Promise<Work[]> {
    const { results } = await this.notion.databases.query({
      database_id,
      filter: {
        and: [
          {
            property: 'status',
            select: {
              does_not_equal: 'Finalizado',
            },
          },

          {
            property: this.newChapterToken,
            checkbox: {
              equals: false,
            },
          },
        ],
      },
    });

    return results.map((item) => NotionMapper.toDomain(item as NotionPage));
  }

  async getNotionPageContent(page_id: string) {
    const response = await this.notion.blocks.children.list({
      block_id: page_id,
      page_size: 100,
    });

    return response.results;
  }

  async setSyncIdInNotionPage(page_id: string, sync_id: string) {
    await this.notion.pages.update({
      page_id,
      properties: {
        sync_id: [
          {
            type: 'text',
            text: {
              content: sync_id,
            },
          },
        ],
      },
    });
  }

  async saveMany(works: Work[]): Promise<void> {
    for (const work of works) {
      await this.notion.pages.update({
        page_id: work.recipientId,
        properties: NotionMapper.toNotion(work),
      });
    }
  }
}
