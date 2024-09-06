import { CreateTagCommand } from '@app/infra/crqs/work/commands/create-tag.command';
import { FetchPagedTagsQuery } from '@app/infra/crqs/work/queries/fetch-paged-tags';
import { ProtectFor } from '@infra/crqs/auth/role.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TagHttpModel, TagModelPaged } from '../models/tag.model';
import { CreateTagDto } from '../validators/create-tag.dto';
import { ListTagParams } from '../validators/list-tags-params';
import { UpdateTagDto } from '../validators/update-tag.dto';
import { UpdateTagCommand } from '@infra/crqs/work/commands/update-tag-command';
import { ParseObjectIdPipe } from '@infra/utils/parse-objectId.pipe';
import { DeleteTagCommand } from '@infra/crqs/work/commands/delete-tag.command';
import { FilterTagBySearchQuery } from '@infra/crqs/work/queries/filter-tag-by-search';
import { FilterTagDto } from '@infra/http/validators/filter-tag.dto';

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ProtectFor('ADMIN')
  @Post()
  async create(@Body() { name, color }: CreateTagDto) {
    await this.commandBus.execute(new CreateTagCommand(name, color));
  }

  @ProtectFor('ADMIN')
  @Put('/:id')
  async updateTag(@Body() data: UpdateTagDto, @Param('id') id: string) {
    await this.commandBus.execute(new UpdateTagCommand(id, data.name, data.color));
  }

  @ProtectFor(['USER', 'SUBSCRIBED_USER', 'ADMIN'])
  @Get()
  @ApiOkResponse({ type: TagModelPaged })
  async listTags(@Query() params: ListTagParams) {
    const response = await this.queryBus.execute(new FetchPagedTagsQuery(params.page));

    return TagHttpModel.toHttpListPaged(response.tags, response.totalOfPages);
  }

  @ProtectFor('ADMIN')
  @Delete('/:id')
  async deleteTag(@Param('id', ParseObjectIdPipe) id: string) {
    await this.commandBus.execute(new DeleteTagCommand(id));
  }

  @ProtectFor('ADMIN')
  @Get('/filter')
  async filterTag(@Query() { search }: FilterTagDto) {
    const results = await this.queryBus.execute(new FilterTagBySearchQuery(search));

    return TagHttpModel.toHttpList(results);
  }
}
