import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Work } from '@domain/work/enterprise/entities/work';
import { z } from 'zod';
import { S3FileStorageAdapter } from '@infra/storage/s3FileStorage.adapter';

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
  })
  .transform((data) => {
    return {
      ...data,
      imageUrl: data.imageId ? S3FileStorageAdapter.createWorkImageURL(`${data.id}-${data.imageId}`) : null,
    };
  });

export type WorkHttp = z.infer<typeof workSchema>;

export class WorkModel {
  static toHttpList(works: Work[]): WorkHttp[] {
    return z.array(workSchema).parse(works);
  }

  static toHttp(work: Work): WorkHttp {
    return workSchema.parse(work);
  }
}
