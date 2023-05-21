import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Category, Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';

export interface CreateWorkInput {
  name: string;
  chapter: number;
  url: string;
  category: Category;
}

interface CreateWorkOutput {
  work: Work;
}

@Injectable()
export class CreateWorkUseCase {
  constructor(private readonly workRepository: WorkRepository) {}

  async execute({
    category,
    chapter,
    name,
    url,
  }: CreateWorkInput): Promise<CreateWorkOutput> {
    const work = Work.create({
      category,
      chapter: new Chapter(chapter),
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
