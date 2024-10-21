import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { IsPublic } from '../crqs/auth/auth.guard';
import { NotionHealthIndicator } from './health/notion-health.service';
import { PrismaHealtCheckIndicator } from './health/prisma-healt.service';

@Controller('health')
@IsPublic()
export class LoggerController {
  constructor(
    private healtCheckService: HealthCheckService,
    private prismHealtCheckIndicator: PrismaHealtCheckIndicator,
    private notionHealtCheckIndicator: NotionHealthIndicator,
    private memoryHealtCheckIndicator: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async healthCheck() {
    return this.healtCheckService.check([
      () => this.prismHealtCheckIndicator.isHealthy('prisma'),
      () => this.notionHealtCheckIndicator.isHealthy('notion'),
      () => this.memoryHealtCheckIndicator.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
