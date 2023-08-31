import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Work } from '@domain/work/enterprise/entities/work';
import { z } from 'zod';
import { S3FileStorageAdapter } from '@infra/storage/s3FileStorage.adapter';
import { ApiProperty } from '@nestjs/swagger';

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
  })
  .transform((data) => {
    return {
      ...data,
      imageUrl: data.imageId ? S3FileStorageAdapter.createS3FileUrl(`${data.id}-${data.imageId}`) : null,
    };
  });

export type WorkHttpType = z.infer<typeof workSchema>;

export class WorkHttp implements WorkHttpType {
  @ApiProperty()
  chapter: number;
  @ApiProperty()
  hasNewChapter: boolean;
  @ApiProperty()
  id: string;
  @ApiProperty()
  imageId: string;
  @ApiProperty()
  imageUrl: string;
  @ApiProperty()
  isFinished: boolean;
  @ApiProperty()
  name: string;
  @ApiProperty()
  url: string;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  category: string;
}

export class WorkModel {
  static toHttpList(works: Work[]): WorkHttpType[] {
    return z.array(workSchema).parse(works);
  }

  static toHttp(work: Work): WorkHttpType {
    return workSchema.parse(work);
  }
}
