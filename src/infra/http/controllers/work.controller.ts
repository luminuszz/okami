import { BatchService } from '@infra/database/batchs/batch.service';

import { UserTokenDto } from '@app/infra/crqs/auth/dto/user-token.dto';
import { DeleteWorkCommand } from '@app/infra/crqs/work/commands/delete-work.command';
import { FetchWorksScrapingPaginatedReportQuery } from '@app/infra/crqs/work/queries/fetch-for-works-scraping-report-paginated';
import { FetchUserWorksWithFilterQuery } from '@app/infra/crqs/work/queries/fetch-user-works-with-filter.query';
import { Queue } from '@domain/work/application/queue/Queue';
import { RefreshStatus } from '@domain/work/enterprise/entities/work';
import { CreateWorkCommand } from '@infra/crqs/work/commands/create-work.command';
import { MarkWorkFinishedCommand } from '@infra/crqs/work/commands/mark-work-finished.command';
import { MarkWorkReadCommand } from '@infra/crqs/work/commands/mark-work-read.command';
import { MarkWorkUnreadCommand } from '@infra/crqs/work/commands/mark-work-unread.command';
import { UpdateWorkChapterCommand } from '@infra/crqs/work/commands/update-work-chapter.command';
import { UpdateWorkRefreshStatusCommand } from '@infra/crqs/work/commands/update-work-refresh-status.command';
import { UploadWorkImageCommand } from '@infra/crqs/work/commands/upload-work-image.command';
import { FetchForWorkersReadQuery } from '@infra/crqs/work/queries/fetch-for-works-read';
import { FetchForWorkersUnreadQuery } from '@infra/crqs/work/queries/fetch-for-works-unread';
import { WorkHttp, WorkModel, WorkModelPaged } from '@infra/http/models/work.model';
import { CreateWorkSchema } from '@infra/http/validators/create-work.dto';
import { MarkWorkUnreadDto } from '@infra/http/validators/mark-work-unread.dto';
import { ScrappingReportDto } from '@infra/http/validators/scrapping-report.dto';
import { UpdateChapterDto } from '@infra/http/validators/update-chapter.dto';
import { UpdateWorkDto } from '@infra/http/validators/update-work.dto';
import { ParseObjectIdPipe } from '@infra/utils/parse-objectId.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateWorkCommand } from '../../crqs/work/commands/update-work.command';
import { FindOneWorkQuery } from '../../crqs/work/queries/find-one-work';
import { User } from '../user-auth.decorator';
import { FetchScrappingReportQuery } from '../validators/fetch-scrapping-report-query';
import { ListUserWorksQuery } from '../validators/list-user-works-query';

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
  @ApiBody(CreateWorkSchema)
  @Post()
  async createWork(@Req() req: any, @User('id') userId: string) {
    const formData = await req.file();

    const { category, chapter, name, url } = formData.fields;

    const data = {
      category: category.value,
      chapter: chapter.value,
      name: name.value,
      url: url.value,
      file: formData,
    };

    const imageData = await formData.toBuffer();

    await this.commandBus.execute(
      new CreateWorkCommand({
        category: data.category,
        chapter: Number(data.chapter),
        name: data.name,
        url: data.url,
        userId,
        image: {
          imageFile: imageData,
          imageType: formData.filename,
        },
      }),
    );
  }

  @Delete(':id')
  async deleteWork(@Param('id', ParseObjectIdPipe) id: string, @User('id') userId: string) {
    await this.commandBus.execute(new DeleteWorkCommand(id, userId));
  }

  @Get('find/:id')
  @ApiOkResponse({ type: WorkHttp })
  async getById(@Param('id', ParseObjectIdPipe) id: string) {
    const work = await this.queryBus.execute(new FindOneWorkQuery(id));

    return WorkModel.toHttp(work);
  }

  @Patch(':id/update-chapter')
  async updateChapter(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() { chapter }: UpdateChapterDto,
    @User('id') userId: string,
  ) {
    await this.commandBus.execute(new UpdateWorkChapterCommand(id, chapter, userId));
  }

  @Patch(':id/mark-read')
  async markRead(@Param('id', ParseObjectIdPipe) id: string) {
    await this.commandBus.execute(new MarkWorkReadCommand(id));
  }

  @Patch(':id/mark-unread')
  async markUnread(@Param('id', ParseObjectIdPipe) id: string, @Body() data: MarkWorkUnreadDto) {
    await this.commandBus.execute(new MarkWorkUnreadCommand(id, data?.nextChapter));
  }

  @Post('sync-to-notion')
  async syncToNotion(@User() user: UserTokenDto) {
    if (!user.notionDatabaseId) return new BadRequestException('Notion database id not found');

    this.batchService.importNotionDatabaseToMongoDB(user.notionDatabaseId, user.id);
  }

  @Get('/fetch-for-workers-read')
  @ApiOkResponse({ type: WorkHttp, isArray: true })
  async fetchForWorkersRead() {
    const works = await this.queryBus.execute(new FetchForWorkersReadQuery());

    return WorkModel.toHttpList(works);
  }

  @Get('/fetch-for-workers-unread')
  @ApiOkResponse({ type: WorkHttp, isArray: true })
  async fetchForWorkersUnread() {
    const works = await this.queryBus.execute(new FetchForWorkersUnreadQuery());

    return WorkModel.toHttpList(works);
  }

  @Post('refresh-chapters')
  async refreshChapters(@User('id') userId: string) {
    this.queue.refreshAllWorksStatusByUserId(userId);
  }

  @Put('update-work/:id')
  async updateWork(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() data: UpdateWorkDto,
    @User('id') userId: string,
  ) {
    await this.commandBus.execute(new UpdateWorkCommand(id, data, userId));
  }

  @Patch('/mark-finished/:id')
  async markFinished(@Param('id', ParseObjectIdPipe) id: string, @User('id') userId: string) {
    await this.commandBus.execute(new MarkWorkFinishedCommand(id, userId));
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
      });
    }

    const file = await req.file();

    const imageData = await file.toBuffer();

    await this.commandBus.execute(new UploadWorkImageCommand(id, file.filename, imageData));
  }

  @Post('replace-image-from-notion/:databaseId')
  async setWorkImageFromNotion(@Param('databaseId') databaseId: string) {
    void this.batchService.setWorkImageFromNotion(databaseId);
  }

  @Get('fetch-for-works-scraping-report')
  @ApiOkResponse({ type: WorkModelPaged })
  async fetchForWorksScrapingReportPaginated(@Query() query: FetchScrappingReportQuery, @User('id') userId: string) {
    const result = await this.queryBus.execute(
      new FetchWorksScrapingPaginatedReportQuery(query.page, userId, query.filter),
    );

    return {
      data: WorkModel.toHttpList(result.data),
      totalOfPages: result.totalOfPages,
    };
  }

  @Post('scrapping-report')
  async scrappingFallback(@Body() { workId, status }: ScrappingReportDto) {
    const refreshStatus = status === 'success' ? RefreshStatus.SUCCESS : RefreshStatus.FAILED;

    await this.commandBus.execute(new UpdateWorkRefreshStatusCommand(workId, refreshStatus));
  }

  @Post('sync-work')
  async syncWork(@Body('workId', ParseObjectIdPipe) workId: string) {
    await this.queue.refreshWorkStatusOfOneWork(workId);
  }

  @Get('list')
  @ApiOkResponse({ type: WorkHttp, isArray: true })
  async listUserWorks(@User('id') userId: string, @Query() query: ListUserWorksQuery) {
    const works = await this.queryBus.execute(new FetchUserWorksWithFilterQuery(userId, query.status));

    return WorkModel.toHttpList(works);
  }
}
