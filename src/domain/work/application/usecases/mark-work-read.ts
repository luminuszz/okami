import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { WorkNotFoundError } from './errors/work-not-found';

interface MarkWorkReadInput {
  id: string;
}

interface MarkWorkReadOutput {
  work: Work;
}

@Injectable()
export class MarkWorkReadUseCase {
  constructor(private workRepository: WorkRepository) {}

  async execute({ id }: MarkWorkReadInput): Promise<MarkWorkReadOutput> {
    const work = await this.workRepository.findById(id);

    if (!work) {
      throw new WorkNotFoundError();
    }

    work.markAsRead();

    await this.workRepository.save(work);

    return {
      work,
    };
  }
}
