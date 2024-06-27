import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Work } from '@domain/work/enterprise/entities/work';
import { z } from 'zod';

import { ApiProperty } from '@nestjs/swagger';
import { CloudFlareR2StorageAdapter } from '@app/infra/storage/cloudFlare-r2-storage.adapter';
import { TagModel, tagSchema } from './tag.model';

const workSchema = z
  .object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    url: z.string().url(),
    hasNewChapter: z.boolean(),
    chapter: z.preprocess((value: Chapter) => value.getChapter(), z.number()),
    isFinished: z.boolean(),
    imageId: z.string().optional().nullable(),
    imageUrl: z.string().url().nullable().default(null),
    updatedAt: z.date().optional().nullable(),
    category: z.string().optional().nullable(),
    nextChapterUpdatedAt: z.date().optional().nullable(),
    nextChapter: z.preprocess((value: Chapter) => value.getChapter(), z.number().nullable()),
    isDropped: z.boolean(),
    refreshStatus: z.string().nullable(),
    createdAt: z.date().transform((value) => value.toISOString()),
    userId: z.string().nonempty(),
    tags: z.array(tagSchema).optional(),
  })
  .transform((data) => {
    return {
      ...data,
      imageUrl: data.imageId ? CloudFlareR2StorageAdapter.createS3FileUrl(`${data.id}-${data.imageId}`) : null,
    };
  });

export type WorkHttpType = z.infer<typeof workSchema>;
export type TagHttpType = z.infer<typeof tagSchema>;

export class WorkHttp implements WorkHttpType {
  @ApiProperty()
  chapter: number;
  @ApiProperty()
  hasNewChapter: boolean;
  @ApiProperty()
  id: string;
  @ApiProperty()
  imageId: string;
  @ApiProperty({ nullable: true })
  imageUrl: string;
  @ApiProperty()
  isFinished: boolean;
  @ApiProperty()
  name: string;
  @ApiProperty()
  url: string;
  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty()
  category: string;

  @ApiProperty()
  isDropped: boolean;

  @ApiProperty({ nullable: true, type: Date })
  nextChapterUpdatedAt: Date | null;

  @ApiProperty({ nullable: true, type: Number })
  nextChapter: number | null;

  @ApiProperty()
  refreshStatus: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: TagModel, isArray: true })
  tags: TagModel[];
}

export class WorkModel {
  static toHttpList(works: Work[]): WorkHttpType[] {
    return z.array(workSchema).parse(works);
  }

  static toHttp(work: Work): WorkHttpType {
    return workSchema.parse(work);
  }
}
