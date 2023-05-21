import { Category } from '@domain/work/enterprise/entities/work';
import { InMemoryWorkRepository } from 'test/mocks/in-mermory-work-repository';
import { CreateWorkUseCase } from './create-work';

describe('CreateWork', () => {
  let inMemoryWorkRepository: InMemoryWorkRepository;
  let stu: CreateWorkUseCase;

  beforeEach(() => {
    inMemoryWorkRepository = new InMemoryWorkRepository();
    stu = new CreateWorkUseCase(inMemoryWorkRepository);
  });

  it('should create a work', async () => {
    const { work } = await stu.execute({
      category: Category.MANGA,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
    });

    expect(work).toBeDefined();
    expect(work.category).toEqual(Category.MANGA);
    expect(work.chapter.getChapter()).toEqual(1);
    expect(work.name).toEqual('One Piece');
    expect(work.url).toEqual('https://onepiece.com');
  });
});
