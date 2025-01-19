import { ScrappingRefreshStatus } from '@domain/work/enterprise/entities/scrapping-refresh-status'

export abstract class ScrappingRefreshStatusRepository {
  abstract create(data: ScrappingRefreshStatus): Promise<void>
}
