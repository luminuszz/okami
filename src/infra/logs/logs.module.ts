import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { NotionModule } from '../database/notion/notion.module';

import { NotionHealtCheckIndicator } from './health/notion-healt.service';
import { PrismaHealtCheckIndicator } from './health/prisma-healt.service';
import { LoggerController } from './logs.controller';
import { PrometheusModule } from './prometheus/prometheus.module';
import { PrismaModule } from '@infra/database/prisma/prisma.module';

@Module({
  imports: [PrometheusModule, TerminusModule.forRoot(), NotionModule, PrismaModule],
  controllers: [LoggerController],
  providers: [PrismaHealtCheckIndicator, NotionHealtCheckIndicator],
})
export class LoggerModule {}
