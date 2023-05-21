import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Category, Work } from '@domain/work/enterprise/entities/work';
import { Category as PrismaCategory, Work as PrismaWork } from '@prisma/client';

export const enumMapper = (category: Category): PrismaCategory => {
  return PrismaCategory[category];
};

export const workEntityToPrismaMapper = (work: Work): PrismaWork => ({
  category: enumMapper(work.category),
  chapters: work.chapter.getChapter(),
  hasNewChapter: work.hasNewChapter,
  name: work.name,
  createdAt: work.createdAt,
  id: work.id.toString(),
  updatedAt: work.updatedAt,
  url: work.url,
});

export const prismaWorkToEntityMapper = (prismaWork: PrismaWork): Work => {
  const work = Work.create(
    {
      category: prismaWork.category as Category,
      chapter: new Chapter(prismaWork.chapters),
      createdAt: prismaWork.createdAt,
      hasNewChapter: prismaWork.hasNewChapter,
      name: prismaWork.name,
      url: prismaWork.url,
      updatedAt: prismaWork.updatedAt,
    },
    new UniqueEntityID(prismaWork.id),
  );

  return work;
};
