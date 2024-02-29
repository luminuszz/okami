import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { InvalidWorkOperationError } from './errors/invalid-work-operation';
import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';

interface FetchAllUserReadRequest {
  userId: string;
}

type FetchAllUserReadResponse = Either<InvalidWorkOperationError, { works: Work[] }>;

@Injectable()
export class FetchAllUserReadWorks implements UseCaseImplementation<FetchAllUserReadRequest, FetchAllUserReadResponse> {
  constructor(private readonly workRepository: WorkRepository) {}

  async execute({ userId }: FetchAllUserReadRequest): Promise<FetchAllUserReadResponse> {
    const works = await this.workRepository.fetchAllWorksByUserIdAndHasNewChapterFalse(userId);

    return right({ works });
  }
}
