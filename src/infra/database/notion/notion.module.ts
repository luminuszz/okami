import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotionApiAdapter } from './notion-api-adapter.provider';
import { NotionWorkRepository } from './notion-work.repository';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [NotionApiAdapter, NotionWorkRepository],
  exports: [NotionWorkRepository, NotionApiAdapter],
})
export class NotionModule {}
