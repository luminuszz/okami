import { BatchService } from '@app/infra/database/batchs/batch.service';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateWorkCommand } from '../commands/create-work.command';
import { MarkWorkReadCommand } from '../commands/mark-work-read.command';
import { MarkWorkUnreadCommand } from '../commands/mark-work-unread.command';
import { UpdateWorkChapterCommand } from '../commands/update-work-chapter.command';
import { FetchForWorkersReadQuery } from '../queries/fetch-for-works-read.query';
import { WorkModel } from './work.model';
@Controller('work')
export class WorkController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly batchService: BatchService,
  ) {}

  @Post()
  async createWork(@Body() data: any) {
    await this.commandBus.execute(new CreateWorkCommand(data));
  }

  @Get('find/:id')
  async getById(@Param('id') id: string) {}

  @Patch(':id/update-chapater')
  async updateChapter(
    @Param('id') id: string,
    @Body('chapter') chapter: number,
  ) {
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

    return works.map(WorkModel.toHttp);
  }

  @Get('sync-database')
  async syncDatabase() {
    await this.batchService.importNotionDatabaseToMongoDB();
  }
}
