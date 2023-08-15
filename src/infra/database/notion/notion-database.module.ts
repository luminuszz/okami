import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { NotionApiAdapter } from './notion-api-adapter.provider';
import { NotionWorkRepository } from './notion-work.repository';

@Module({
  imports: [CqrsModule, ConfigModule.forRoot()],
  providers: [NotionApiAdapter, NotionWorkRepository],
  exports: [NotionWorkRepository, NotionApiAdapter],
})
export class NotionDatabaseModule {}
