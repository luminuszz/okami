import { z } from 'zod';
import { SearchToken, SearchTokenType } from '@domain/work/enterprise/entities/search-token';
import { ApiProperty } from '@nestjs/swagger';

const searchTokenSchema = z.object({
  token: z.string(),
  type: z.nativeEnum(SearchTokenType),
  createdAt: z.date(),
});

type SearchTokenHttpType = z.infer<typeof searchTokenSchema>;

export class SearchTokenHttp implements SearchTokenHttpType {
  @ApiProperty({
    enum: SearchTokenType,
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
