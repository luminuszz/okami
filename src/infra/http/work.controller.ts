import { BatchService } from '@app/infra/database/batchs/batch.service';

import { CreateWorkCommand } from '@infra/crqs/work/commands/create-work.command';
import { MarkWorkReadCommand } from '@infra/crqs/work/commands/mark-work-read.command';
import { MarkWorkUnreadCommand } from '@infra/crqs/work/commands/mark-work-unread.command';
import { UpdateWorkChapterCommand } from '@infra/crqs/work/commands/update-work-chapter.command';
import { WorkJobsService } from '@infra/crqs/work/jobs/work-job.service';
import { FetchForWorkersReadQuery } from '@infra/crqs/work/queries/fetch-for-works-read';
import { FetchForWorkersUnreadQuery } from '@infra/crqs/work/queries/fetch-for-works-unread';
import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateWorkCommand } from '../crqs/work/commands/update-work.command';
import { WorkModel } from './presentation/work.model';

@Controller('work')
export class WorkController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly batchService: BatchService,
    private readonly workJobs: WorkJobsService,
  ) {}

  @Post()
  async createWork(@Body() data: any) {
    await this.commandBus.execute(new CreateWorkCommand(data));
  }

  @Get('find/:id')
  async getById(@Param('id') id: string) {}

  @Patch(':id/update-chapater')
  async updateChapter(@Param('id') id: string, @Body('chapter') chapter: number) {
    await this.commandBus.execute(new UpdateWorkChapterCommand(id, chapter));
  }

  @Patch(':id/mark-read')
  async markRead(@Param('id') id: string) {
    await this.commandBus.execute(new MarkWorkReadCommand(id));
  }

  @Patch(':id/mark-unread')
  async markUnread(@Param('id') id: string) {
    await this.commandBus.execute(new MarkWorkUnreadCommand(id));
  }

  @Get('/fetch-for-workers-read')
  async fetchForWorkersRead() {
    const works = await this.queryBus.execute(new FetchForWorkersReadQuery());

    return WorkModel.toHttpList(works);
  }

  @Get('/fetch-for-workers-unread')
  async fetchForWorkersUnread() {
    const works = await this.queryBus.execute(new FetchForWorkersUnreadQuery());

    return WorkModel.toHttpList(works);
  }

  @Get('sync-database')
  async syncDatabase() {
    await this.batchService.importNotionDatabaseToMongoDB();
  }

  @Get('refresh-chapters')
  async refreshChapters() {
    await this.workJobs.triggerQueueFindSerieEpisodeQueue();
  }

  @Put('update-work')
  async updateWork(@Body() { data, id }: any) {
    await this.commandBus.execute(new UpdateWorkCommand(id, data));
  }
}
