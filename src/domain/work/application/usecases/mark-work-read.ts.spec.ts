import { Category } from '@domain/work/enterprise/entities/work';
import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { CreateWorkUseCase } from './create-work';
import { WorkNotFoundError } from './errors/work-not-found';
import { MarkWorkReadUseCase } from './mark-work-read';
import { MarkWorkUnreadUseCase } from '@domain/work/application/usecases/mark-work-unread';
import { faker } from '@faker-js/faker';

describe('MarkWorkRead', () => {
  let stu: MarkWorkReadUseCase;
  let workRepository: InMemoryWorkRepository;
  let createWork: CreateWorkUseCase;

  beforeEach(() => {
    workRepository = new InMemoryWorkRepository();
    stu = new MarkWorkReadUseCase(workRepository);
    createWork = new CreateWorkUseCase(workRepository);
  });

  it('should mark work as read', async () => {
    const response = await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
      userId: faker.string.uuid(),
    });

    if (response.isLeft()) throw response.value;

    const { work: workCreated } = response.value;

    const result = await stu.execute({ id: workCreated.id });

    const work = await workRepository.findById(workCreated.id);

    expect(result.isRight()).toBeTruthy();

    expect(work.hasNewChapter).toBeFalsy();
  });

  it('should not mark work as read if work not exists', async () => {
    await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
      userId: faker.string.uuid(),
    });

    const result = await stu.execute({ id: 'NOT_EXISTS_ID' });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WorkNotFoundError);
  });

  test('expect to nextChapter prop to be null on work marked read', async () => {
    const markUnread = new MarkWorkUnreadUseCase(workRepository);

    const response = await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
      userId: faker.string.uuid(),
    });

    if (response.isLeft()) throw response.value;

    const { work: workCreated } = response.value;

    await markUnread.execute({ id: workCreated.id, nextChapter: 2 });

    const result = await stu.execute({ id: workCreated.id });

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.hasNewChapter).toBeFalsy();
      expect(result.value.nextChapter.getChapter()).toBeNull();
    }
  });
});
