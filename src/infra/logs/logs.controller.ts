import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { NotionHealtCheckIndicator } from './health/notion-healt.service';
import { PrismaHealtCheckIndicator } from './health/prisma-healt.service';

@Controller('health')
export class LoggerController {
  constructor(
    private healtCheckService: HealthCheckService,
    private prismHealtCheckIndicator: PrismaHealtCheckIndicator,
    private notionHealtCheckIndicator: NotionHealtCheckIndicator,
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
