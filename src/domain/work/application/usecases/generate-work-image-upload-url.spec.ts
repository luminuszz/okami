import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Category, Work, WorkStatus } from '@domain/work/enterprise/entities/work';
import { faker } from '@faker-js/faker/.';
import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { fakeStorageProvider } from '@test/mocks/mocks';
import { StorageProvider } from '../contracts/storageProvider';
import { WorkNotFoundError } from './errors/work-not-found';
import { GenerateWorkImageUploadUrlUseCase } from './generate-work-image-upload-url';

describe('GenerateWorkImageUploadUrlUseCase', () => {
  let workRepository: InMemoryWorkRepository;
  let storageProvider: StorageProvider;
  let stu: GenerateWorkImageUploadUrlUseCase;

  beforeEach(() => {
    workRepository = new InMemoryWorkRepository();
    storageProvider = fakeStorageProvider;
    stu = new GenerateWorkImageUploadUrlUseCase(storageProvider, workRepository);
  });

  it('should be able to generate a upload url', async () => {
    const work = Work.create({
      name: 'Naruto',
      category: Category.ANIME,
      chapter: new Chapter(1),
      url: 'https://naruto.com',
      userId: faker.string.uuid(),
      createdAt: new Date(),
      status: WorkStatus.READ,
      description: faker.lorem.lines(2),
    });

    await workRepository.create(work);

    fakeStorageProvider.createUploadUrl.mockResolvedValueOnce(faker.internet.url());

    const results = await stu.execute({
      image: {
        fileName: 'image',
        fileType: 'png',
      },
      workId: work.id,
    });

    expect(results.isRight()).toBe(true);

    if (results.isRight()) {
      expect(results.value.uploadUrl).toBeDefined();
      expect(results.value.filename).toBeDefined();
    }

    expect(workRepository.works[0].imageId).toBeDefined();
  });

  it('should not be able to generate a upload url if work not found', async () => {
    const work = Work.create({
      name: 'Naruto',
      category: Category.ANIME,
      chapter: new Chapter(1),
      url: 'https://naruto.com',
      userId: faker.string.uuid(),
      createdAt: new Date(),
      status: WorkStatus.READ,
      description: faker.lorem.lines(2),
    });

    await workRepository.create(work);

    fakeStorageProvider.createUploadUrl.mockResolvedValueOnce(faker.internet.url());

    const FAKE_ID = faker.string.uuid();

    const results = await stu.execute({
      image: {
        fileName: 'image',
        fileType: 'png',
      },
      workId: FAKE_ID,
    });

    expect(results.isLeft()).toBe(true);

    expect(results.value).toBeInstanceOf(WorkNotFoundError);
  });
});
