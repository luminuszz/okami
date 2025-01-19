import { Either, left, right } from '@core/either'
import { ResourceNotFound } from '@core/errors/resource-not-found'
import { UseCaseImplementation } from '@core/use-case'
import { ScrappingRefreshStatus } from '@domain/work/enterprise/entities/scrapping-refresh-status'
import { RefreshStatus } from '@domain/work/enterprise/entities/work'
import { Injectable } from '@nestjs/common'
import { ScrappingRefreshStatusRepository } from '../repositories/scrapping-refresh-status-repository'
import { WorkRepository } from '../repositories/work-repository'

export interface RegisterScrappingStatusInput {
  workId: string
  status: RefreshStatus
  message?: string
}

export type RegisterScrappingStatusOutput = Either<ResourceNotFound, ScrappingRefreshStatus>

@Injectable()
export class RegisterScrappingStatus
  implements UseCaseImplementation<RegisterScrappingStatusInput, RegisterScrappingStatusOutput>
{
  constructor(
    private workRepository: WorkRepository,
    private scrappingRefreshStatusRepository: ScrappingRefreshStatusRepository,
  ) {}

  async execute({ status, workId, message }: RegisterScrappingStatusInput): Promise<RegisterScrappingStatusOutput> {
    const existsWork = await this.workRepository.findById(workId)

    if (!existsWork) {
      return left(new ResourceNotFound('Work not found'))
    }

    const scrappingStatus = ScrappingRefreshStatus.create({
      message: message ?? null,
      status,
      workId: existsWork.id,
    })

    await this.scrappingRefreshStatusRepository.create(scrappingStatus)

    return right(scrappingStatus)
  }
}
