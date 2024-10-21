import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { NotionDatabaseModule } from '../database/notion/notion-database.module';

import { PrismaModule } from '@infra/database/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { NotionHealthIndicator } from './health/notion-health.service';
import { PrismaHealtCheckIndicator } from './health/prisma-healt.service';
import { LoggerController } from './logs.controller';
import { PrometheusModule } from './prometheus/prometheus.module';

@Module({
  imports: [HttpModule.register({}), PrometheusModule, TerminusModule.forRoot(), NotionDatabaseModule, PrismaModule],
  controllers: [LoggerController],
  providers: [PrismaHealtCheckIndicator, NotionHealthIndicator],
})
export class LoggerModule {}
