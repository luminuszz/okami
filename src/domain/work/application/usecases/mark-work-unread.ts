import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { WorkNotFoundError } from './errors/work-not-found';

interface MarkWorkUnreadInput {
  id: string;
}

interface MarkWorkUnreadOutput {
  work: Work;
}

@Injectable()
export class MarkWorkUnreadUseCase {
  constructor(private workRepository: WorkRepository) {}

  async execute({ id }: MarkWorkUnreadInput): Promise<MarkWorkUnreadOutput> {
    const work = await this.workRepository.findById(id);

    if (!work) {
      throw new WorkNotFoundError();
    }

    work.markAsUnread();

    await this.workRepository.save(work);

    return {
      work,
    };
  }
}
