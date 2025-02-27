import { SearchToken, SearchTokenType } from '@domain/work/enterprise/entities/search-token';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

const searchTokenSchema = z.object({
  id: z.string(),
  token: z.string(),
  type: z.nativeEnum(SearchTokenType),
  createdAt: z.date(),
});

type SearchTokenHttpType = z.infer<typeof searchTokenSchema>;

export class SearchTokenHttp implements SearchTokenHttpType {
  @ApiProperty()
  id: string;

  @ApiProperty({
    enum: ['ANIME', 'MANGA'],
  })
  type: SearchTokenType;

  @ApiProperty()
  token: string;

  @ApiProperty()
  createdAt: Date;
}

export class SearchTokenModel {
  static toHttpList(searchTokens: SearchToken[]): SearchTokenHttpType[] {
    return z.array(searchTokenSchema).parse(searchTokens);
  }
}
