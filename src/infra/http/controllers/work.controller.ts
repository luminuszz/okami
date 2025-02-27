import { BatchService } from '@infra/database/batchs/batch.service'

import { UserTokenDto } from '@app/infra/crqs/auth/dto/user-token.dto'
import { DeleteWorkCommand } from '@app/infra/crqs/work/commands/delete-work.command'
import {
  GenerateWorkImageUploadUrlCommand,
  GenerateWorkImageUploadUrlCommandResults,
} from '@app/infra/crqs/work/commands/generate-work-image-upload-url.command'
import { FetchWorksScrapingPaginatedReportQuery } from '@app/infra/crqs/work/queries/fetch-for-works-scraping-report-paginated'
import { FetchUserWorksWithFilterAndPagedQuery } from '@app/infra/crqs/work/queries/fetch-user-works-with-filter-and-paged'
import { FetchUserWorksWithFilterQuery } from '@app/infra/crqs/work/queries/fetch-user-works-with-filter.query'
import { Queue } from '@domain/work/application/queue/Queue'
import { RefreshStatus } from '@domain/work/enterprise/entities/work'
import { CreateWorkCommand } from '@infra/crqs/work/commands/create-work.command'
import { MarkWorkFinishedCommand } from '@infra/crqs/work/commands/mark-work-finished.command'
import { MarkWorkReadCommand } from '@infra/crqs/work/commands/mark-work-read.command'
import { MarkWorkUnreadCommand } from '@infra/crqs/work/commands/mark-work-unread.command'
import { ToggleFavoriteCommand } from '@infra/crqs/work/commands/toggle-favorite.command'
import { UpdateWorkChapterCommand } from '@infra/crqs/work/commands/update-work-chapter.command'
import { UpdateWorkRefreshStatusCommand } from '@infra/crqs/work/commands/update-work-refresh-status.command'
import { UploadWorkImageCommand } from '@infra/crqs/work/commands/upload-work-image.command'
import { FetchFavoritesWorksQuery } from '@infra/crqs/work/queries/fetch-favorites-works'
import { FetchForWorkersReadQuery } from '@infra/crqs/work/queries/fetch-for-works-read'
import { FetchForWorkersUnreadQuery } from '@infra/crqs/work/queries/fetch-for-works-unread'
import { WorkHttp, WorkModel, WorkModelPaged, WorkUploadUrlResponseModel } from '@infra/http/models/work.model'
import { CreateWorkApiShape, createWorkSchema } from '@infra/http/validators/create-work.dto'
import { MarkWorkUnreadDto } from '@infra/http/validators/mark-work-unread.dto'
import { ScrappingReportDto } from '@infra/http/validators/scrapping-report.dto'
import { UpdateChapterDto } from '@infra/http/validators/update-chapter.dto'
import { UpdateWorkDto } from '@infra/http/validators/update-work.dto'
import { ParseObjectIdPipe } from '@infra/utils/parse-objectId.pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { HttpStatusCode } from 'axios'
import { UpdateWorkCommand } from '../../crqs/work/commands/update-work.command'
import { FindOneWorkQuery } from '../../crqs/work/queries/find-one-work'
import { ScrappingReportWorkModel, scrappingReportHttpSchema } from '../models/scrapping-report.model'
import { User } from '../user-auth.decorator'
import { FetchScrappingReportQuery } from '../validators/fetch-scrapping-report-query'
import { GetWorkUploadUrlDto } from '../validators/get-work-upload-url.dto'
import { ListUserWorkQueryPaged, ListUserWorksQuery } from '../validators/list-user-works-query'

@ApiTags('work')
@Controller('work')
export class WorkController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly batchService: BatchService,
    private readonly queue: Queue,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody(CreateWorkApiShape)
  @Post()
  @HttpCode(201)
  async createWork(@Req() req: any, @User('id') userId: string) {
    const data = createWorkSchema.parse(req.body)

    await this.commandBus.execute(
      new CreateWorkCommand({
        category: data.category,
        chapter: Number(data.chapter),
        alternativeName: data.alternativeName,
        name: data.name,
        url: data.url,
        tagsId: data.tagsId,
        userId,
        image: {
          imageFile: data.file.buffer,
          imageType: data.file.filename,
        },
      }),
    )
  }

  @Delete(':id')
  async deleteWork(@Param('id', ParseObjectIdPipe) id: string, @User('id') userId: string) {
    await this.commandBus.execute(new DeleteWorkCommand(id, userId))
  }

  @Get('find/:id')
  @ApiOkResponse({ type: WorkHttp })
  async getById(@Param('id', ParseObjectIdPipe) id: string) {
    const work = await this.queryBus.execute(new FindOneWorkQuery(id))

    return WorkModel.toHttp(work)
  }

  @Patch(':id/update-chapter')
  async updateChapter(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() { chapter }: UpdateChapterDto,
    @User('id') userId: string,
  ) {
    await this.commandBus.execute(new UpdateWorkChapterCommand(id, chapter, userId))
  }

  @Patch(':id/mark-read')
  async markRead(@Param('id', ParseObjectIdPipe) id: string) {
    await this.commandBus.execute(new MarkWorkReadCommand(id))
  }

  @Patch(':id/mark-unread')
  async markUnread(@Param('id', ParseObjectIdPipe) id: string, @Body() data: MarkWorkUnreadDto) {
    await this.commandBus.execute(new MarkWorkUnreadCommand(id, data.nextChapter))
  }

  @Post('sync-to-notion')
  async syncToNotion(@User() user: UserTokenDto) {
    if (!user.notionDatabaseId) return new BadRequestException('Notion database id not found')

    void this.batchService.importNotionDatabaseToMongoDB(user.notionDatabaseId, user.id)
  }

  @Get('/fetch-for-workers-read')
  @ApiOkResponse({ type: WorkHttp, isArray: true })
  async fetchForWorkersRead() {
    const works = await this.queryBus.execute(new FetchForWorkersReadQuery())

    return WorkModel.toHttpList(works)
  }

  @Get('/fetch-for-workers-unread')
  @ApiOkResponse({ type: WorkHttp, isArray: true })
  async fetchForWorkersUnread() {
    const works = await this.queryBus.execute(new FetchForWorkersUnreadQuery())

    return WorkModel.toHttpList(works)
  }

  @Post('refresh-chapters')
  async refreshChapters(@User('id') userId: string) {
    void this.queue.refreshAllWorksStatusByUserId(userId)
  }

  @Put('update-work/:id')
  async updateWork(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() data: UpdateWorkDto,
    @User('id') userId: string,
  ) {
    await this.commandBus.execute(new UpdateWorkCommand(id, data, userId))
  }

  @Patch('/mark-finished/:id')
  async markFinished(@Param('id', ParseObjectIdPipe) id: string, @User('id') userId: string) {
    await this.commandBus.execute(new MarkWorkFinishedCommand(id, userId))
  }

  @Post('/upload-work-image/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'object',
    schema: {
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadWorkImage(@Param('id', ParseObjectIdPipe) id: string, @Req() req: any) {
    if (!req.isMultipart()) {
      return new BadRequestException({
        message: 'Invalid file',
      })
    }

    const { file } = req.body

    await this.commandBus.execute(new UploadWorkImageCommand(id, file.filename, file.buffer))
  }

  @Post('replace-image-from-notion/:databaseId')
  async setWorkImageFromNotion(@Param('databaseId') databaseId: string) {
    void this.batchService.setWorkImageFromNotion(databaseId)
  }

  @Get('fetch-for-works-scraping-report')
  @ApiOkResponse({ type: ScrappingReportWorkModel })
  async fetchForWorksScrapingReportPaginated(@Query() query: FetchScrappingReportQuery, @User('id') userId: string) {
    const result = await this.queryBus.execute(
      new FetchWorksScrapingPaginatedReportQuery(query.page, userId, query.filter, query.search),
    )

    return scrappingReportHttpSchema.parse({
      data: result.data,
      totalOfPages: result.totalOfPages,
    })
  }

  @Post('scrapping-report')
  async scrappingFallback(@Body() { workId, status }: ScrappingReportDto) {
    const refreshStatus = status === 'success' ? RefreshStatus.SUCCESS : RefreshStatus.FAILED

    await this.commandBus.execute(new UpdateWorkRefreshStatusCommand(workId, refreshStatus))
  }

  @Post('sync-work')
  async syncWork(@Body('workId', ParseObjectIdPipe) workId: string) {
    await this.queue.refreshWorkStatusOfOneWork(workId)
  }

  @Get('list')
  @ApiOkResponse({ type: WorkHttp, isArray: true })
  async listUserWorks(@User('id') userId: string, @Query() query: ListUserWorksQuery) {
    const works = await this.queryBus.execute(
      new FetchUserWorksWithFilterQuery(userId, {
        status: query.status,
        search: query.search,
      }),
    )

    return WorkModel.toHttpList(works)
  }

  @Get('list/paged')
  @ApiOkResponse({ type: WorkModelPaged })
  async listUserWorksPaged(@User('id') userId: string, @Query() query: ListUserWorkQueryPaged) {
    const results = await this.queryBus.execute(
      new FetchUserWorksWithFilterAndPagedQuery(userId, {
        status: query.status,
        search: query.search,
        limit: Number(query.limit) as any,
        page: Number(query.page),
      }),
    )

    return {
      totalOfPages: results.totalOfPages,
      works: WorkModel.toHttpList(results.works),
      nextPage: results.nextPage,
    }
  }

  @Patch(':id/toggle-favorite')
  @HttpCode(201)
  async toggleFavorite(@Param('id', ParseObjectIdPipe) workId: string) {
    await this.commandBus.execute(new ToggleFavoriteCommand(workId))
  }

  @Get('/favorites')
  @ApiOkResponse({ type: WorkHttp, isArray: true })
  async fetchWorksFavorites(@User('id') userId: string) {
    const results = await this.queryBus.execute(new FetchFavoritesWorksQuery(userId))

    return WorkModel.toHttpList(results)
  }

  @Post('/upload/get-upload-url')
  @ApiOkResponse({ type: WorkUploadUrlResponseModel })
  @HttpCode(HttpStatusCode.Ok)
  async getUploadUrl(@Body() { fileName, fileType, workId }: GetWorkUploadUrlDto): Promise<WorkUploadUrlResponseModel> {
    const { filename, url } = await this.commandBus.execute<
      GenerateWorkImageUploadUrlCommand,
      GenerateWorkImageUploadUrlCommandResults
    >(
      new GenerateWorkImageUploadUrlCommand(
        {
          filename: fileName,
          filetype: fileType,
        },
        workId,
      ),
    )

    return {
      filename,
      url,
    }
  }
}
