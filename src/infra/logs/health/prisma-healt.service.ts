import { PrismaService } from '@app/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { PrometheusService } from '../prometheus/prometheus.service';

@Injectable()
export class PrismaHealtCheckIndicator extends HealthIndicator {
  constructor(
    private readonly prismaService: PrismaService,
    private prometheusService: PrometheusService,
  ) {
    super();
    this.prometheusService.registerMetric({
      help: 'Prisma health check',
      labelNames: ['status', 'message', 'error'],
      name: PrismaHealtCheckIndicator.name,
    });
  }

  public async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prismaService.$connect();

      this.prometheusService.getMetric(PrismaHealtCheckIndicator.name).observe(1);

      return this.getStatus(key, true);
    } catch (error) {
      this.prometheusService.getMetric(PrismaHealtCheckIndicator.name).observe(1);
      throw new HealthCheckError('Prisma health check failed', error);
    }
  }
}
