import { AuthGuard } from '@app/infra/crqs/auth/auth.guard';
import { BatchService } from '@app/infra/database/batchs/batch.service';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../user-auth.decorator';

@ApiTags('tags')
@UseGuards(AuthGuard)
@Controller('tags')
export class TagController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly batchService: BatchService,
  ) {}

  @Post()
  async create(@User('notionDatabaseId') databaseId: string) {
    await this.batchService.setAllTagsFromNotionDatabase(databaseId);
  }
}
