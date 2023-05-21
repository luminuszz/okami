import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client as NotionClient } from '@notionhq/client';

@Injectable()
export class NotionApiAdapter extends NotionClient {
  public database_id: string;

  constructor(private configService: ConfigService) {
    super({
      auth: configService.get<string>('NOTION_AUTH_TOKEN'),
    });

    this.database_id = configService.get<string>('NOTION_DATABASE_ID');
  }
}
