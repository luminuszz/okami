import { Category } from '@domain/work/enterprise/entities/work';
import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { CreateWorkUseCase } from './create-work';
import { WorkNotFoundError } from './errors/work-not-found';
import { UpdateWorkUseCase } from './update-work';
import { faker } from '@faker-js/faker';
import { InMemoryTagRepository } from '@test/mocks/in-memory-tag-repository';

describe('UpdateWorkChapterUseCase', () => {
  let stu: UpdateWorkUseCase;
  let workRepository: InMemoryWorkRepository;
  let createWork: CreateWorkUseCase;
  let tagRepository: InMemoryTagRepository;

  beforeEach(() => {
    tagRepository = new InMemoryTagRepository();
    workRepository = new InMemoryWorkRepository();
    stu = new UpdateWorkUseCase(workRepository, tagRepository);
    createWork = new CreateWorkUseCase(workRepository);
  });

  it('should mark work as read', async () => {
    const workCreatedResponse = await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
      userId: faker.string.uuid(),
    });

    if (workCreatedResponse.isLeft()) throw workCreatedResponse.value;

    const { work } = workCreatedResponse.value;

    const result = await stu.execute({
      userId: work.userId,
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

    const userId = faker.string.uuid();

    await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
      userId,
    });

    const result = await stu.execute({ id: 'NOT_EXISTS_ID', userId, data: { chapter: 10 } });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WorkNotFoundError);
  });
});
