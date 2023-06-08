import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

interface Metric {
  name: string;
  help: string;
  labelNames: string[];
}

@Injectable()
export class PrometheusService {
  private register: client.Registry;

  public service_prefix = 'okami_';

  private metrics: Map<string, client.Histogram> = new Map();

  constructor() {
    this.register = new client.Registry();

    client.collectDefaultMetrics({ register: this.register });

    client.Pushgateway;
  }

  public registerMetric({ help, labelNames, name }: Metric) {
    const metric = new client.Histogram<any>({
      help,
      name: `${this.service_prefix}${name}`,
      labelNames,
    });

    this.register.registerMetric(metric);
    this.metrics.set(name, metric);
  }

  public getMetrics() {
    return this.register.metrics();
  }

  public getRegister() {
    return this.register;
  }
  public getMetric(name: string) {
    console.log(
      'this.metrics',
      this.metrics.get(`${this.service_prefix}${name}`),
    );

    return this.metrics.get(name);
  }
}
