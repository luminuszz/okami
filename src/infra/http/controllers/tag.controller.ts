import { CreateTagCommand } from '@app/infra/crqs/work/commands/create-tag.command';
import { FetchPagedTagsQuery } from '@app/infra/crqs/work/queries/fetch-paged-tags';
import { ProtectFor } from '@infra/crqs/auth/role.guard';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TagModelPaged, TahHttpModel } from '../models/tag.model';
import { CreateTagDto } from '../validators/create-tag.dto';
import { ListTagParams } from '../validators/list-tags-params';
import { UpdateTagDto } from '../validators/update-tag.dto';
import { UpdateTagCommand } from '@infra/crqs/work/commands/update-tag-command';

@ApiTags('tags')
@Controller('tags')
@ProtectFor('ADMIN')
export class TagController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() { name, color }: CreateTagDto) {
    await this.commandBus.execute(new CreateTagCommand(name, color));
  }

  @Put('/:id')
  async updateTag(@Body() data: UpdateTagDto, @Param('id') id: string) {
    await this.commandBus.execute(new UpdateTagCommand(id, data.name, data.color));
  }

  @Get()
  @ApiOkResponse({ type: TagModelPaged })
  async listTags(@Query() params: ListTagParams) {
    const response = await this.queryBus.execute(new FetchPagedTagsQuery(params.page));

    return TahHttpModel.toHttpListPaged(response.tags, response.totalOfPages);
  }
}
