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

export class TagModelPaged {
  @ApiProperty({ type: TagModel, isArray: true })
  data: TagModel[];

  @ApiProperty()
  totalOfPages: number;
}

export class TagHttpModel {
  static toHttpList(tags: Tag[]) {
    return z.array(tagSchema).parse(tags);
  }
  static toHttpListPaged(data: Tag[], totalOfPages: number) {
    return z
      .object({
        totalOfPages: z.coerce.number(),
        data: z.array(tagSchema),
      })
      .parse({ data, totalOfPages });
  }
}
