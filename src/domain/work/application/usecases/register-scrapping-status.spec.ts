import { ResourceNotFound } from '@core/errors/resource-not-found'
import { RefreshStatus, Work } from '@domain/work/enterprise/entities/work'
import { faker } from '@faker-js/faker/locale/af_ZA'
import { InMemoryScrappingRefreshStatusRepository } from '@test/mocks/in-memory-scrapping-refresh-status-repository'
import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository'
import { createWorkPropsFactory } from '@test/mocks/mocks'
import { RegisterScrappingStatus } from './register-scrapping-status'

describe('RegisterScrappingStatus', () => {
  let workRepository: InMemoryWorkRepository
  let scrappingRefreshStatusRepository: InMemoryScrappingRefreshStatusRepository

  let stu: RegisterScrappingStatus

  beforeAll(() => {
    workRepository = new InMemoryWorkRepository()
    scrappingRefreshStatusRepository = new InMemoryScrappingRefreshStatusRepository()

    stu = new RegisterScrappingStatus(workRepository, scrappingRefreshStatusRepository)
  })

  it(' should be able to register a scrapping status SUCCESS', async () => {
    const work = Work.create(createWorkPropsFactory())

    await workRepository.create(work)

    const result = await stu.execute({
      workId: work.id,
      status: RefreshStatus.SUCCESS,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      const scrappingStatus = result.value

      expect(scrappingStatus.workId).toBe(work.id)
      expect(scrappingStatus.status).toBe(RefreshStatus.SUCCESS)
    }
  })

  it('not should be able to register a scrapping status if work not exists', async () => {
    const work = Work.create(createWorkPropsFactory())

    await workRepository.create(work)

    const result = await stu.execute({
      workId: faker.string.uuid(),
      status: RefreshStatus.SUCCESS,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it(' should be able to register a scrapping status with message', async () => {
    const work = Work.create(createWorkPropsFactory())

    await workRepository.create(work)

    const message = faker.lorem.sentence()

    const result = await stu.execute({
      workId: work.id,
      status: RefreshStatus.FAILED,
      message,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      const scrappingStatus = result.value

      expect(scrappingStatus.workId).toBe(work.id)
      expect(scrappingStatus.status).toBe(RefreshStatus.FAILED)
      expect(scrappingStatus.message).toBe(message)
    }
  })
})
