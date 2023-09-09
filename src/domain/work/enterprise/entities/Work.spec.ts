import { Category, Work } from '@domain/work/enterprise/entities/work';
import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { faker } from '@faker-js/faker';
import { WorkMarkReadEvent } from '@domain/work/enterprise/entities/events/work-marked-read';
import { WorkMarkUnreadEvent } from '@domain/work/enterprise/entities/events/work-marked-unread';
import { WorkMarkedFinishedEvent } from '@domain/work/enterprise/entities/events/work-marked-finished-event';
import { User } from '@domain/auth/enterprise/entities/User';

const makeWorkModk = () => ({
  category: Category.MANGA,
  chapter: new Chapter(faker.number.int({ max: 1000, min: 1 })),
  nextChapter: new Chapter(faker.number.int({ max: 1000, min: 1 })),
  hasNewChapter: faker.datatype.boolean(),
  createdAt: new Date(),
  name: faker.name.firstName(),
  url: faker.internet.url(),
});

describe('WorkEntity', () => {
  it('should be able to create a new Work', () => {
    const data = makeWorkModk();

    const work = Work.create(data);

    expect(work).toBeDefined();
    expect(work.category).toEqual(Category.MANGA);
    expect(work.chapter.getChapter()).toEqual(data.chapter.getChapter());
    expect(work.name).toEqual(data.name);
    expect(work.url).toEqual(data.url);
  });

  it('should be able to updateChapter', () => {
    const data = makeWorkModk();

    const work = Work.create(data);

    work.updateChapter(40);

    expect(work.chapter.getChapter()).toEqual(40);
  });

  it('should be able to markAsRead', () => {
    const work = Work.create(makeWorkModk());

    work.markAsRead();

    expect(work.hasNewChapter).toEqual(false);
    expect(work.nextChapter.getChapter()).toEqual(null);

    expect(work.events[0]).toBeInstanceOf(WorkMarkReadEvent);
  });

  it('should be able to markAsUnread', () => {
    const work = Work.create(makeWorkModk());

    const randomChapter = faker.number.int({ max: 1000, min: 1 });

    work.markAsUnread(randomChapter);

    expect(work.hasNewChapter).toEqual(true);

    expect(work.events[0]).toBeInstanceOf(WorkMarkUnreadEvent);
  });

  it('should be able to updateNextChapter', () => {
    const work = Work.create(makeWorkModk());

    const randomChapter = faker.number.int({ max: 1000, min: 1 });

    work.updateNextChapter(randomChapter);

    expect(work.nextChapter.getChapter()).toEqual(randomChapter);
    expect(work.nextChapterUpdatedAt).toBeInstanceOf(Date);
    expect(work.nextChapterUpdatedAt).toBeTruthy();
  });

  it('should be able to markAsFinished', () => {
    const work = Work.create(makeWorkModk());

    work.markAsFinished();

    expect(work.isFinished).toBe(true);

    expect(work.events[0]).toBeInstanceOf(WorkMarkedFinishedEvent);
  });

  it('should be able to addSubscriber', () => {
    const work = Work.create(makeWorkModk());

    work.addSubscriber(User.create({ name: 'user', createdAt: new Date(), works: [], email: '', passwordHash: '' }));

    expect(work.subscribers.length).toBe(1);
  });
});
