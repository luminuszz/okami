import { UpdateWorkUseCase } from '@domain/work/application/usecases/update-work'
import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image'
import { WorkCreatedEvent } from '@domain/work/enterprise/entities/events/work-created'
import { NotionWorkRepository } from '@infra/database/notion/notion-work.repository'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import { Logger } from '@nestjs/common'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { NotionImageObject } from '../dto/notion-image.dto'
import { NotionMapper } from '../notion.mappter'

@EventsHandler(WorkCreatedEvent)
export class OnWorkCreatedEventHandlerNotion implements IEventHandler<WorkCreatedEvent> {
  constructor(
    private notionRepository: NotionWorkRepository,
    private uploadWorkImage: UploadWorkImageUseCase,
    private updateWork: UpdateWorkUseCase,
  ) {}

  private logger = new Logger(OnWorkCreatedEventHandlerNotion.name)

  async handle({ payload }: WorkCreatedEvent) {
    if (!payload.recipientId) return

    await this.notionRepository.setSyncIdInNotionPage(payload.recipientId, payload.id)

    const notionPageDetails = await this.notionRepository.getNotionPageContent(payload.recipientId)

    const results = (notionPageDetails.find((item: any) => item.type === 'image') as NotionImageObject) || null

    if (results) {
      const { image } = results

      const imageUrl = image.type === 'external' ? image.external.url : image.file.url

      const response = await this.uploadWorkImage.execute({
        imageBuffer: imageUrl,
        workId: payload.id,
        fileType: 'png',
      })

      if (response.isLeft()) {
        throw response.value
      }
    }
  }
}

@EventsHandler(WorkCreatedEvent)
export class OnWorkCreatedSetDescriptionEventHandlerNotion implements IEventHandler<WorkCreatedEvent> {
  constructor(
    private notionRepository: NotionWorkRepository,
    private readonly prisma: PrismaService,
  ) {}

  private logger = new Logger(OnWorkCreatedSetDescriptionEventHandlerNotion.name)

  async handle({ payload: work }: WorkCreatedEvent) {
    if (!work.recipientId) return

    const notionPageDetails = await this.notionRepository.getNotionPageContent(work.recipientId)

    const description = NotionMapper.extractDescriptionFromNotionPage(notionPageDetails)

    if (description) {
      await this.prisma.work.update({
        where: {
          id: work.id,
        },
        data: {
          description,
        },
      })
    }
  }
}
