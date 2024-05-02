import { AuthGuard } from '@app/infra/crqs/auth/auth.guard';
import { CreateTagCommand } from '@app/infra/crqs/work/commands/create-tag.command';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CreateTagDto } from '../validators/create-tag.dto';
import { FetchPagedTagsQuery } from '@app/infra/crqs/work/queries/fetch-paged-tags';
import { ListTagParams } from '../validators/list-tags-params';
import { TahHttpModel } from '../models/tag.model';

@ApiTags('tags')
@UseGuards(AuthGuard)
@Controller('tags')
export class TagController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() { name }: CreateTagDto) {
    await this.commandBus.execute(new CreateTagCommand(name));
  }

  @Get()
  async litsTags(@Query() params: ListTagParams) {
    const response = await this.queryBus.execute(new FetchPagedTagsQuery(params.page));

    return TahHttpModel.toHttpList(response);
  }
}
