import { NotionApiAdapter } from '@app/infra/database/notion/notion-api-adapter.provider';
import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { PrometheusService } from '../prometheus/prometheus.service';

@Injectable()
export class NotionHealtCheckIndicator extends HealthIndicator {
  constructor(
    private readonly notionService: NotionApiAdapter,
    private prometheusService: PrometheusService,
  ) {
    super();
    this.prometheusService.registerMetric({
      help: 'Notion health check',
      labelNames: ['status', 'message', 'error'],
      name: NotionHealtCheckIndicator.name,
    });
  }

  public async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.notionService.getHealthStatus();

      this.prometheusService.getMetric(NotionHealtCheckIndicator.name).observe(1);

      return this.getStatus(key, true);
    } catch (error) {
      this.prometheusService.getMetric(NotionHealtCheckIndicator.name).observe(1);
      throw new HealthCheckError('Notion health check failed', error);
    }
  }
}
