import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { FindOneWorkUseCase } from './fnd-one-work';
import { Category } from '@domain/work/enterprise/entities/work';
import { CreateWorkUseCase } from './create-work';
import { faker } from '@faker-js/faker';

describe('FindOneWork', () => {
  let stu: FindOneWorkUseCase;
  let workRepository: InMemoryWorkRepository;

  beforeEach(() => {
    workRepository = new InMemoryWorkRepository();
    stu = new FindOneWorkUseCase(workRepository);
  });

  it('should be able return a work', async () => {
    const createWork = new CreateWorkUseCase(workRepository);

    const response = await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
      userId: faker.string.uuid(),
    });

    if (response.isLeft()) throw response.value;

    const result = await stu.execute({ id: response.value.work.id });

    expect(result.isRight()).toBeTruthy();
    expect(result.value.work.name).toBe('One Piece');
  });

  it('should a null value if work not exsits', async () => {
    const createWork = new CreateWorkUseCase(workRepository);

    await createWork.execute({
      category: Category.ANIME,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
      userId: faker.string.uuid(),
    });

    const result = await stu.execute({ id: 'fake id' });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value.work).toBeNull();
  });
});
