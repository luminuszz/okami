import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { WorkNotFoundError } from '@domain/work/application/usecases/errors/work-not-found';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '@domain/work/application/repositories/work-repository';

interface ToggleWorkIsFavorite {
  workId: string;
}

type ToggleWorkFavoriteResponse = Either<WorkNotFoundError, null>;

@Injectable()
export class ToggleWorkFavorite implements UseCaseImplementation<ToggleWorkIsFavorite, ToggleWorkFavoriteResponse> {
  constructor(private readonly workRepository: WorkRepository) {}

  async execute({ workId }: ToggleWorkIsFavorite): Promise<ToggleWorkFavoriteResponse> {
    const existsWork = await this.workRepository.findById(workId);

    if (!existsWork) {
      return left(new WorkNotFoundError());
    }
    existsWork.toggleFavorite();

    await this.workRepository.save(existsWork);

    return right(null);
  }
}
