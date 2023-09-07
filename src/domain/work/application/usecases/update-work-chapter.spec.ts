import { Category } from '@domain/work/enterprise/entities/work';
import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { CreateWorkUseCase } from './create-work';
import { UpdateWorkChapterUseCase } from './update-work-chapter';

describe('CreateWork', () => {
  let inMemoryWorkRepository: InMemoryWorkRepository;
  let stu: UpdateWorkChapterUseCase;
  let createWork: CreateWorkUseCase;

  beforeEach(() => {
    inMemoryWorkRepository = new InMemoryWorkRepository();
    stu = new UpdateWorkChapterUseCase(inMemoryWorkRepository);
    createWork = new CreateWorkUseCase(inMemoryWorkRepository);
  });

  it('should to update a work chapter', async () => {
    const { work } = await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'Naruto',
      url: 'https://naruto.com',
    });

    await stu.execute({ chapter: 2, id: work.id });

    expect(inMemoryWorkRepository.works[0].chapter.getChapter()).toBe(2);
  });
});
