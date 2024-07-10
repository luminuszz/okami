import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CreateSearchTokenDto } from '@infra/http/validators/create-search-token.dto';
import { CreateSearchTokenCommand } from '@infra/crqs/work/commands/create-search-token.command';
import { CreateManySearchTokensDto } from '@infra/http/validators/create-many-search-tokens';
import { CreateManySearchTokensCommand } from '@infra/crqs/work/commands/create-many-search-tokens.command';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SearchTokenHttp, SearchTokenModel } from '@infra/http/models/search-token.model';
import { ListSearchTokensByTypeDto } from '@infra/http/validators/list-search-tokens-by-type.dto';
import { FetchForSearchTokensByTypeQuery } from '@infra/crqs/work/queries/fetch-for-search-tokens-by-type';
import { ParseObjectIdPipe } from '@infra/utils/parse-objectId.pipe';
import { DeleteSearchTokenCommand } from '@infra/crqs/work/commands/delete-search-token.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@ApiTags('search-token')
@Controller('search-token')
export class SearchTokenController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createSearchToken(@Body() { token, type }: CreateSearchTokenDto) {
    await this.commandBus.execute(new CreateSearchTokenCommand(token, type));
  }

  @Post('/batch')
  async createManySearchTokens(@Body() { tokens }: CreateManySearchTokensDto) {
    await this.commandBus.execute(new CreateManySearchTokensCommand(tokens));
  }

  @Get()
  @ApiOkResponse({ type: SearchTokenHttp, isArray: true })
  async listSearchTokens(@Query() { type }: ListSearchTokensByTypeDto) {
    const results = await this.queryBus.execute(new FetchForSearchTokensByTypeQuery(type));

    return SearchTokenModel.toHttpList(results);
  }

  @Delete(':id')
  async deleteSearchToken(@Param('id', ParseObjectIdPipe) id: string) {
    await this.commandBus.execute(new DeleteSearchTokenCommand(id));
  }
}
