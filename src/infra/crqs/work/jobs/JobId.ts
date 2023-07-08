export class JobId {
  static getJobId = (id: string, chapter: number) => `work-${id}-lastChapter-${chapter}`;
}
