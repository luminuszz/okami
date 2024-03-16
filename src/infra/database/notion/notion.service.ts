import { EnvService } from '@app/infra/env/env.service';
import { Injectable } from '@nestjs/common';
import { Client as NotionClient } from '@notionhq/client';

@Injectable()
export class NotionService extends NotionClient {
  constructor(env: EnvService) {
    super({
      auth: env.get('NOTION_AUTH_TOKEN'),
    });
  }

  public async getHealthStatus() {
    return this.databases.query({ database_id: '' });
  }
}
