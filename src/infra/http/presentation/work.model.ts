import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Work } from '@domain/work/enterprise/entities/work';
import { z } from 'zod';

const workSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  url: z.string().url(),
  hasNewChapter: z.boolean(),
  chapter: z.preprocess((value: Chapter) => value.getChapter(), z.number()),
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
