import { Category, Work, WorkStatus } from "@app/domain/work/enterprise/entities/work";
import { UniqueEntityID } from "@core/entities/unique-entity-id";
import { Tag } from "@domain/work/enterprise/entities/tag";
import { Chapter } from "@domain/work/enterprise/entities/values-objects/chapter";
import { Slug } from "@domain/work/enterprise/entities/values-objects/slug";
import { NotionPage } from "./dto/notion-page.dto";

export type NotionDocument = {
  object: "page";
};

type NotionCategory = "Anime" | "Manga" | "Webtoon" | "MANHUA" | "Light novel";

export class NotionMapper {
  private static notionCategoryToDomainMapper: Record<NotionCategory, Category> = {
    Anime: Category.ANIME,
    Manga: Category.MANGA,
    Webtoon: Category.MANGA,
    MANHUA: Category.MANGA,
    "Light novel": Category.MANGA,
  };

  static extractDescriptionFromNotionPage(notionPage: any): string {
    const parsed = notionPage.filter((item: any) => item.type === "paragraph") as any;

    return parsed.map((item) => item.paragraph.rich_text.map((item: any) => item.text.content).join(" ")).join("");
  }

  static toDomain({ properties, id }: NotionPage): Work {
    const category = NotionMapper.notionCategoryToDomainMapper?.[properties.Tipo.select?.name as NotionCategory]
      ? NotionMapper.notionCategoryToDomainMapper[properties.Tipo.select.name || ("Manga" as NotionCategory)]
      : Category.MANGA;

    return Work.create(
      {
        category,
        chapter: new Chapter(properties.cap.number || 0),
        createdAt: new Date(properties.Created.created_time),
        status: properties["CAPITULO NOVO"].checkbox ? WorkStatus.UNREAD : WorkStatus.READ,
        name: properties?.Name?.title?.[0]?.text?.content,
        recipientId: id,
        url: properties.URL.url,
        updatedAt: new Date(properties["last edited"].last_edited_time),
        userId: "",
        tags: properties["Gêneros"]?.multi_select.map((notionTag) => Tag.create({ name: notionTag.name, slug: new Slug(notionTag.name) })),
        alternativeName: properties["Nome_alternativo"]?.rich_text?.[0]?.text?.content ?? "",
        description: "",
      },
      new UniqueEntityID(properties?.sync_id?.rich_text?.[0]?.text?.content || null)
    );
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
