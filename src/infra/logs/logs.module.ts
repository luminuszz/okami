import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { NotionModule } from '../database/notion/notion.module';
import { PrismaModule } from '../database/prisma/prisma.module';
import { NotionHealtCheckIndicator } from './health/notion-healt.service';
import { PrismaHealtCheckIndicator } from './health/prisma-healt.service';
import { LoggerController } from './logs.controller';
import { PrometheusModule } from './prometheus/prometheus.module';

@Module({
  imports: [
    PrometheusModule,
    TerminusModule.forRoot(),
    PrismaModule,
    NotionModule,
  ],
  controllers: [LoggerController],
  providers: [PrismaHealtCheckIndicator, NotionHealtCheckIndicator],
})
export class LoggerModule {}
