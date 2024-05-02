import { Tag } from '@domain/work/enterprise/entities/tag';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  color: z.string(),
});

export type TagHttpType = z.infer<typeof tagSchema>;

export class TagModel implements TagHttpType {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  color: string;
}

export class TahHttpModel {
  static toHttpList(tags: Tag[]) {
    return z.array(tagSchema).parse(tags);
  }
}
