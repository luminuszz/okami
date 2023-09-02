import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { WorkNotFoundError } from './errors/work-not-found';

interface UpdateWorkChapterInput {
  id: string;
  chapter: number;
}

interface UpdateWorkChapterOutput {
  work: Work;
}

@Injectable()
export class UpdateWorkChapterUseCase {
  constructor(private readonly workRepository: WorkRepository) {}

  async execute({ chapter, id }: UpdateWorkChapterInput): Promise<UpdateWorkChapterOutput> {
    const work = await this.workRepository.findById(id);

    if (!work) {
      throw new WorkNotFoundError();
    }

    const currentWorkChapter = work.chapter.getChapter();

    work.updateChapter(chapter);

    if (chapter >= currentWorkChapter) {
      work.markAsRead();
    }

    await this.workRepository.save(work);

    return {
      work,
    };
  }
}
