import { BatchService } from '@infra/database/batchs/batch.service';

import { MarkWorkAsDroppedCommand } from '@app/infra/crqs/work/commands/mark-work-as-dropped.command';
import { FetchWorksScrapingPaginatedReportQuery } from '@app/infra/crqs/work/queries/fetch-for-works-scraping-report-paginated';
import { Queue } from '@domain/work/application/queue/Queue';
import { RefreshStatus } from '@domain/work/enterprise/entities/work';
import { AuthGuard } from '@infra/crqs/auth/auth.guard';
import { CreateWorkCommand } from '@infra/crqs/work/commands/create-work.command';
import { MarkWorkFinishedCommand } from '@infra/crqs/work/commands/mark-work-finished.command';
import { MarkWorkReadCommand } from '@infra/crqs/work/commands/mark-work-read.command';
import { MarkWorkUnreadCommand } from '@infra/crqs/work/commands/mark-work-unread.command';
import { UpdateWorkChapterCommand } from '@infra/crqs/work/commands/update-work-chapter.command';
import { UpdateWorkRefreshStatusCommand } from '@infra/crqs/work/commands/update-work-refresh-status.command';
import { UploadWorkImageCommand } from '@infra/crqs/work/commands/upload-work-image.command';
import { FetchForWorkersReadQuery } from '@infra/crqs/work/queries/fetch-for-works-read';
import { FetchForWorkersUnreadQuery } from '@infra/crqs/work/queries/fetch-for-works-unread';
import { WorkHttp, WorkModel } from '@infra/http/models/work.model';
import { CreateWorkDto } from '@infra/http/validators/create-work.dto';
import { MarkWorkUnreadDto } from '@infra/http/validators/mark-work-unread.dto';
import { ScrappingReportDto } from '@infra/http/validators/scrapping-report.dto';
import { UpdateChapterDto } from '@infra/http/validators/update-chapter.dto';
import { UpdateWorkDto } from '@infra/http/validators/update-work.dto';
import { ParseObjectIdPipe } from '@infra/utils/parse-objectId.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateWorkCommand } from '../../crqs/work/commands/update-work.command';
import { FindOneWorkQuery } from '../../crqs/work/queries/find-one-work';
import { FetchScrappingReportQuery } from '../validators/fetch-scrapping-report-query';

@UseGuards(AuthGuard)
@ApiTags('work')
@Controller('work')
export class WorkController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly batchService: BatchService,
    private readonly queue: Queue,
  ) {}

  @Post()
  async createWork(@Body() data: CreateWorkDto) {
    await this.commandBus.execute(new CreateWorkCommand(data));
  }

  @Get('find/:id')
  @ApiOkResponse({ type: WorkHttp })
  async getById(@Param('id', ParseObjectIdPipe) id: string) {
    const work = await this.queryBus.execute(new FindOneWorkQuery(id));

    return WorkModel.toHttp(work);
  }

  @Patch(':id/update-chapter')
  async updateChapter(@Param('id', ParseObjectIdPipe) id: string, @Body() { chapter }: UpdateChapterDto) {
    await this.commandBus.execute(new UpdateWorkChapterCommand(id, chapter));
  }

  @Patch(':id/mark-read')
  async markRead(@Param('id', ParseObjectIdPipe) id: string) {
    await this.commandBus.execute(new MarkWorkReadCommand(id));
  }

  @Patch(':id/mark-unread')
  async markUnread(@Param('id', ParseObjectIdPipe) id: string, @Body() data: MarkWorkUnreadDto) {
    await this.commandBus.execute(new MarkWorkUnreadCommand(id, data?.nextChapter));
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

  @Post('sync-database')
  async syncDatabase(@Body('databaseId') databaseId: string) {
    this.batchService.importNotionDatabaseToMongoDB(databaseId);
  }

  @Post('refresh-chapters')
  async refreshChapters() {
    this.queue.refreshWorkStatus();
  }

  @Put('update-work/:id')
  async updateWork(@Param('id', ParseObjectIdPipe) id: string, @Body() data: UpdateWorkDto) {
    await this.commandBus.execute(new UpdateWorkCommand(id, data));
  }

  @Patch('/mark-finished/:id')
  async markFinished(@Param('id', ParseObjectIdPipe) id: string) {
    await this.commandBus.execute(new MarkWorkFinishedCommand(id));
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

  @Get('replace-image-from-notion')
  async setWorkImageFromNotion(@Body('databaseId') databaseId: string) {
    await this.batchService.setWorkImageFromNotion(databaseId);
  }

  @Get('fetch-for-works-scraping-report')
  @ApiOkResponse({ type: WorkHttp, isArray: true })
  async fetchForWorksScrapingReportPaginated(@Query() query: FetchScrappingReportQuery) {
    const result = await this.queryBus.execute(new FetchWorksScrapingPaginatedReportQuery(query.page, query.filter));

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

  @Patch('dropped/:workId')
  async markWorkAsDropped(@Param('workId', ParseObjectIdPipe) workId: string) {
    await this.commandBus.execute(new MarkWorkAsDroppedCommand(workId));
  }

  @Post('sync-work')
  async syncWork(@Body('workId', ParseObjectIdPipe) workId: string) {
    await this.queue.refreshWorkStatusOfOneWork(workId);
  }
}
