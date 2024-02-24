import { EnvService } from '@app/infra/env/env.service';
import { Injectable } from '@nestjs/common';
import { Client as NotionClient } from '@notionhq/client';

@Injectable()
export class NotionApiAdapter extends NotionClient {
  public database_id: string;

  constructor(private readonly env: EnvService) {
    super({
      auth: env.get('NOTION_AUTH_TOKEN'),
    });

    this.database_id = this.env.get('NOTION_DATABASE_ID');
  }

  public async getHealthStatus() {
    return this.databases.query({
      database_id: this.database_id,
    });
  }
}
