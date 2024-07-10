import { CreateTagCommand } from '@app/infra/crqs/work/commands/create-tag.command';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateTagDto } from '../validators/create-tag.dto';
import { FetchPagedTagsQuery } from '@app/infra/crqs/work/queries/fetch-paged-tags';
import { ListTagParams } from '../validators/list-tags-params';
import { TagModel, TahHttpModel } from '../models/tag.model';

@ApiTags('tags')
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
  @ApiOkResponse({
    isArray: true,
    type: TagModel,
  })
  async listTags(@Query() params: ListTagParams) {
    const response = await this.queryBus.execute(new FetchPagedTagsQuery(params.page));

    return TahHttpModel.toHttpList(response);
  }
}
