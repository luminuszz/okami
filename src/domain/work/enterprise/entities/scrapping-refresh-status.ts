import { Entity } from '@core/entities/entity'
import { UniqueEntityID } from '@core/entities/unique-entity-id'
import { Replace } from '@core/replaced'
import { RefreshStatus } from './work'

export interface ScrappingRefreshStatusProps {
  status: RefreshStatus
  workId: string
  message: string | null

  createdAt: Date
  updatedAt: Date | null
}

type ScrappingRefreshStatusConstructor = Replace<
  ScrappingRefreshStatusProps,
  {
    createdAt?: Date
    updatedAt?: Date
  }
>

export class ScrappingRefreshStatus extends Entity<ScrappingRefreshStatusProps> {
  private constructor(props: ScrappingRefreshStatusConstructor, id?: UniqueEntityID) {
    super(
      {
        createdAt: props.createdAt ?? new Date(),
        message: props.message,
        status: props.status,
        updatedAt: props.updatedAt || null,
        workId: props.workId,
      },
      id,
    )
  }

  public static create(props: ScrappingRefreshStatusConstructor, id?: UniqueEntityID): ScrappingRefreshStatus {
    return new ScrappingRefreshStatus(props, id)
  }

  get status() {
    return this.props.status
  }

  get workId() {
    return this.props.workId
  }

  get message() {
    return this.props.message
  }

  get createdAt() {
    return this.props.createdAt
  }
}
