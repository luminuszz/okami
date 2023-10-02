import { Category, Work } from '@app/domain/work/enterprise/entities/work';
import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { NotionPage } from './dto/notion-page.dto';

export type NotionDocument = {
  object: 'page';
};

type NotionCategory = 'Anime' | 'Manga' | 'Webtoon';

export class NotionMapper {
  private static notionCategoryToDomainMapper: Record<NotionCategory, Category> = {
    Anime: Category.ANIME,
    Manga: Category.MANGA,
    Webtoon: Category.MANGA,
  };

  static toDomain({ properties, id }: NotionPage): Work {
    const category = NotionMapper.notionCategoryToDomainMapper?.[properties.Tipo.select?.name as NotionCategory]
      ? NotionMapper.notionCategoryToDomainMapper[properties.Tipo.select.name || ('Manga' as NotionCategory)]
      : Category.MANGA;

    return Work.create({
      category,
      chapter: new Chapter(properties.cap.number || 0),
      createdAt: new Date(properties.Created.created_time),
      hasNewChapter: properties['CAPITULO NOVO'].checkbox,
      name: properties?.Name?.title?.[0]?.text?.content,
      recipientId: id,
      url: properties.URL.url,
      updatedAt: new Date(properties['last edited'].last_edited_time),
      userId: '64d13f0978a515e634ac1384',
    });
  }

  static toNotion(work: Work) {
    return {
      cap: work.chapter.getChapter(),
      Name: work.name,
      URL: work.url,
    };
  }

  static parseCategoryEnumToNotion(category: Category): NotionCategory {
    return NotionMapper.notionCategoryToDomainMapper[category];
  }
}
