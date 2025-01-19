import { ScrappingRefreshStatusRepository } from '@domain/work/application/repositories/scrapping-refresh-status-repository'
import { ScrappingRefreshStatus } from '@domain/work/enterprise/entities/scrapping-refresh-status'

export class InMemoryScrappingRefreshStatusRepository implements ScrappingRefreshStatusRepository {
  public scrappingRefreshStatus: ScrappingRefreshStatus[] = []

  async create(data: ScrappingRefreshStatus): Promise<void> {
    await this.scrappingRefreshStatus.push(data)
  }
}
