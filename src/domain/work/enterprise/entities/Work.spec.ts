import { WorkMarkedFinishedEvent } from '@domain/work/enterprise/entities/events/work-marked-finished-event';
import { WorkMarkReadEvent } from '@domain/work/enterprise/entities/events/work-marked-read';
import { WorkMarkUnreadEvent } from '@domain/work/enterprise/entities/events/work-marked-unread';
import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Category, Work, WorkStatus } from '@domain/work/enterprise/entities/work';
import { faker } from '@faker-js/faker';

const makeWorkMock = () => ({
  category: faker.helpers.arrayElement([Category.MANGA, Category.ANIME]),
  chapter: new Chapter(faker.number.int({ max: 1000, min: 1 })),
  name: faker.internet.userName(),
  url: faker.internet.url(),
  createdAt: new Date(),
  userId: faker.string.uuid(),
  status: WorkStatus.READ,
  nextChapter: new Chapter(null),
});

describe('WorkEntity', () => {
  it('should be able to create a new Work', () => {
    const data = makeWorkMock();

    const work = Work.create(data);

    expect(work).toBeDefined();
    expect(work.category).toEqual(data.category);
    expect(work.chapter.getChapter()).toEqual(data.chapter.getChapter());
    expect(work.name).toEqual(data.name);
    expect(work.url).toEqual(data.url);
  });

  it('should be able to updateChapter', () => {
    const data = makeWorkMock();

    const work = Work.create(data);

    work.updateChapter(40);

    expect(work.chapter.getChapter()).toEqual(40);
  });

  it('should be able to markAsRead', () => {
    const work = Work.create(makeWorkMock());

    work.markAsRead();

    expect(work.hasNewChapter).toEqual(false);
    expect(work.nextChapter.getChapter()).toEqual(null);

    expect(work.events[0]).toBeInstanceOf(WorkMarkReadEvent);
  });

  it('should be able to markAsUnread', () => {
    const workData = makeWorkMock();

    const work = Work.create(workData);

    const randomChapter = faker.number.int({ max: 1000, min: 1 });

    work.markAsUnread(randomChapter);

    expect(work.hasNewChapter).toEqual(true);
    expect(work.nextChapter.getChapter()).toEqual(randomChapter);
    expect(work.chapter.getChapter()).toBe(workData.chapter.getChapter());

    expect(work.events[0]).toBeInstanceOf(WorkMarkUnreadEvent);
  });

  it('should be able to updateNextChapter', () => {
    const work = Work.create(makeWorkMock());

    const randomChapter = faker.number.int({ max: 1000, min: 1 });

    work.updateNextChapter(randomChapter);

    expect(work.nextChapter.getChapter()).toEqual(randomChapter);
    expect(work.nextChapterUpdatedAt).toBeInstanceOf(Date);
    expect(work.nextChapterUpdatedAt).toBeTruthy();
  });

  it('should be able to markAsFinished', () => {
    const work = Work.create(makeWorkMock());

    work.markAsFinished();

    expect(work.isFinished).toBe(true);

    expect(work.events[0]).toBeInstanceOf(WorkMarkedFinishedEvent);
  });
});
