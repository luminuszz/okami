import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Category, Work } from '@domain/work/enterprise/entities/work';
import { WorkRepository } from '../repositories/work-repository';

export interface CreateWorkInput {
  name: string;
  chapter: number;
  url: string;
  category: Category;
  image?: {
    imageFile: ArrayBuffer;
    imageType: string;
  };
}

interface CreateWorkOutput {
  work: Work;
}

export class CreateWorkUseCase {
  constructor(private readonly workRepository: WorkRepository) {}

  async execute({ category, chapter, name, url }: CreateWorkInput): Promise<CreateWorkOutput> {
    const work = Work.create({
      category,
      chapter: new Chapter(chapter),
      nextChapter: new Chapter(null),
      hasNewChapter: false,
      name,
      url,
      createdAt: new Date(),
    });

    await this.workRepository.create(work);

    return {
      work,
    };
  }
}
