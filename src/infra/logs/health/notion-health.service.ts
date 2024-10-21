import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotionHealthIndicator extends HealthIndicator {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  private notionApiStatusUrl = 'https://status.notion.so/api/v2/status.json';

  public async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await firstValueFrom(this.httpService.get(this.notionApiStatusUrl), { defaultValue: null });

      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError('Notion health check failed', error);
    }
  }
}
