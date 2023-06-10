import { Category } from '@domain/work/enterprise/entities/work';
import { InMemoryWorkRepository } from 'test/mocks/in-mermory-work-repository';
import { CreateWorkUseCase } from './create-work';
import { WorkNotFoundError } from './errors/work-not-found';
import { UpdateWorkUseCase } from './update-work';

describe('UpdateWorkChapterUseCase', () => {
  let stu: UpdateWorkUseCase;
  let workRepository: InMemoryWorkRepository;

  beforeEach(() => {
    workRepository = new InMemoryWorkRepository();
    stu = new UpdateWorkUseCase(workRepository);
  });

  it('should mark work as read', async () => {
    const createWork = new CreateWorkUseCase(workRepository);

    const { work } = await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
    });

    const result = await stu.execute({
      id: work.id,
      data: {
        chapter: 0,
        name: 'One Piece 2',
        url: 'https://onepiece.com/2',
      },
    });

    const response = await workRepository.findById(work.id);

    if (result.isRight()) {
      expect(response.chapter.getChapter()).toBe(0);
      expect(response.name).toBe('One Piece 2');
      expect(response.url).toBe('https://onepiece.com/2');
    }
  });

  it('should not update work if works not exist', async () => {
    const createWork = new CreateWorkUseCase(workRepository);

    await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
    });

    const result = await stu.execute({ id: 'NOT_EXISTS_ID', data: { chapter: 10 } });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WorkNotFoundError);
  });
});
