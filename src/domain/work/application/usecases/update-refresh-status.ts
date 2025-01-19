import { Either, left, right } from '@core/either'
import { UseCaseImplementation } from '@core/use-case'
import { WorkRepository } from '@domain/work/application/repositories/work-repository'
import { WorkNotFoundError } from '@domain/work/application/usecases/errors/work-not-found'
import { RefreshStatus, Work } from '@domain/work/enterprise/entities/work'
import { Injectable } from '@nestjs/common'
import { RegisterScrappingStatus } from './register-scrapping-status'

interface UpdateRefreshStatusUseCasePayload {
  workId: string
  refreshStatus: RefreshStatus
  message?: string
}

type UpdateRefreshStatusUseCaseResult = Either<WorkNotFoundError, Work>

@Injectable()
export class UpdateRefreshStatusUseCase
  implements UseCaseImplementation<UpdateRefreshStatusUseCasePayload, UpdateRefreshStatusUseCaseResult>
{
  constructor(
    private workRepository: WorkRepository,
    private registerScrappingStatus: RegisterScrappingStatus,
  ) {}

  async execute({
    workId,
    refreshStatus,
    message,
  }: UpdateRefreshStatusUseCasePayload): Promise<UpdateRefreshStatusUseCaseResult> {
    const work = await this.workRepository.findById(workId)

    if (!work) {
      return left(new WorkNotFoundError())
    }

    work.refreshStatus = refreshStatus

    await this.workRepository.save(work)

    await this.registerScrappingStatus.execute({
      workId,
      status: refreshStatus,
      message,
    })

    return right(work)
  }
}
