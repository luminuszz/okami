import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { Category } from '@domain/work/enterprise/entities/work';
import { faker } from '@faker-js/faker';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { fakeHashProvider } from '@test/mocks/mocks';
import { CreateWorkUseCase } from './create-work';

describe('CreateWork', () => {
  let inMemoryWorkRepository: InMemoryWorkRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let stu: CreateWorkUseCase;
  let createUser: CreateUserUseCase;

  beforeEach(() => {
    inMemoryWorkRepository = new InMemoryWorkRepository();
    inMemoryUserRepository = new InMemoryUserRepository();

    stu = new CreateWorkUseCase(inMemoryWorkRepository);
    createUser = new CreateUserUseCase(fakeHashProvider, inMemoryUserRepository);
  });

  it('should create a work', async () => {
    const userResults = await createUser.execute({
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
    });

    if (userResults.isLeft()) throw userResults.value;

    const { user } = userResults.value;

    const response = await stu.execute({
      category: Category.MANGA,
      chapter: 1,
      name: 'One Piece',
      url: 'https://onepiece.com',
      userId: user.id,
    });

    if (response.isRight()) {
      const {
        value: { work },
      } = response;

      expect(work).toBeDefined();
      expect(work.category).toEqual(Category.MANGA);
      expect(work.chapter.getChapter()).toEqual(1);
      expect(work.name).toEqual('One Piece');
      expect(work.url).toEqual('https://onepiece.com');
    }
  });
});
