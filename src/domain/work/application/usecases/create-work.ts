import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Category, Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { UseCaseImplementation } from '@core/use-case';
import { Either, right } from '@core/either';

export interface CreateWorkInput {
  name: string;
  chapter: number;
  url: string;
  category: Category;
  image?: {
    imageFile: ArrayBuffer;
    imageType: string;
  };
  userId: string;
}

type CreateWorkOutput = Either<void, { work: Work }>;

@Injectable()
export class CreateWorkUseCase implements UseCaseImplementation<CreateWorkInput, CreateWorkOutput> {
  constructor(private readonly workRepository: WorkRepository) {}

  async execute({ category, chapter, name, url, userId }: CreateWorkInput): Promise<CreateWorkOutput> {
    const work = Work.create({
      category,
      chapter: new Chapter(chapter),
      nextChapter: new Chapter(null),
      hasNewChapter: false,
      name,
      url,
      createdAt: new Date(),
      userId,
    });

    await this.workRepository.create(work);

    return right({ work });
  }
}
