import { Category } from '@domain/work/enterprise/entities/work';
import { InMemoryWorkRepository } from 'test/mocks/in-mermory-work-repository';
import { CreateWorkUseCase } from './create-work';
import { WorkNotFoundError } from './errors/work-not-found';
import { MarkWorkReadUseCase } from './mark-work-read';
import { expect, test } from 'vitest';
import { MarkWorkUnreadUseCase } from '@domain/work/application/usecases/mark-work-unread';

describe('MarkWorkRead', () => {
  let stu: MarkWorkReadUseCase;
  let workRepository: InMemoryWorkRepository;

  beforeEach(() => {
    workRepository = new InMemoryWorkRepository();
    stu = new MarkWorkReadUseCase(workRepository);
  });

  it('should mark work as read', async () => {
    const createWork = new CreateWorkUseCase(workRepository);

    const work = await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
    });

    const result = await stu.execute({ id: work.work.id });
    const response = await workRepository.findById(work.work.id);

    expect(result.isRight()).toBeTruthy();
    expect(response.hasNewChapter).toBeFalsy();
  });

  it('should not mark work as read if work not exists', async () => {
    const createWork = new CreateWorkUseCase(workRepository);

    await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
    });

    const result = await stu.execute({ id: 'NOT_EXISTS_ID' });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WorkNotFoundError);
  });

  test('expect to nextChapter prop to be null on work marked read', async () => {
    const createWork = new CreateWorkUseCase(workRepository);

    const markUnread = new MarkWorkUnreadUseCase(workRepository);

    const { work } = await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
    });

    await markUnread.execute({ id: work.id, nextChapter: 2 });

    const result = await stu.execute({ id: work.id });

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.hasNewChapter).toBeFalsy();
      expect(result.value.nextChapter).toBeNull();
    }
  });
});
