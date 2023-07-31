import { Category } from '@domain/work/enterprise/entities/work';
import { InMemoryWorkRepository } from 'test/mocks/in-mermory-work-repository';
import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image';
import { expect, vi } from 'vitest';
import { CreateWorkUseCase } from '@domain/work/application/usecases/create-work';
import { faker } from '@faker-js/faker';
import { WorkNotFoundError } from '@domain/work/application/usecases/errors/work-not-found';

const fakeStorageProvider = {
  uploadWorkImage: vi.fn(),
};

describe('UploadWorkImageUseCase', () => {
  let inMemoryWorkRepository: InMemoryWorkRepository;
  let stu: UploadWorkImageUseCase;
  let createWork: CreateWorkUseCase;

  beforeEach(() => {
    inMemoryWorkRepository = new InMemoryWorkRepository();
    stu = new UploadWorkImageUseCase(fakeStorageProvider, inMemoryWorkRepository);
    createWork = new CreateWorkUseCase(inMemoryWorkRepository);
  });

  it('should be able to upload file ', async () => {
    const { work } = await createWork.execute({
      chapter: 1,
      name: 'Naruto',
      url: 'https://naruto.com',
      category: Category.ANIME,
    });

    fakeStorageProvider.uploadWorkImage.mockResolvedValueOnce(null);

    const results = await stu.execute({
      imageBuffer: new ArrayBuffer(1),
      workId: work.id,
      fileType: 'png',
    });

    console.log(results.value);

    expect(fakeStorageProvider.uploadWorkImage).toHaveBeenCalled();
    expect(results.isRight()).toBe(true);

    if (results.isRight()) {
      expect(results.value.imageId).toBeDefined();
      expect(results.value.imageId.includes('.png')).toBeTruthy();
    }
  });

  it('should not be able to upload file if Work not exists ', async () => {
    await createWork.execute({
      chapter: 1,
      name: faker.person.firstName(),
      url: faker.internet.url(),
      category: Category.ANIME,
    });

    fakeStorageProvider.uploadWorkImage.mockResolvedValueOnce({});

    const results = await stu.execute({
      imageBuffer: new ArrayBuffer(1),
      workId: 'INVALID ID',
      fileType: 'image/png',
    });

    expect(results.isLeft()).toBe(true);
    expect(results.value).toBeInstanceOf(WorkNotFoundError);
  });
});
