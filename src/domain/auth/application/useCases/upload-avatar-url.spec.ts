import { expect, vi } from 'vitest';
import { UploadUserAvatarImage } from '@domain/auth/application/useCases/upload-user-avatar-image';
import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { InMemoryUserRepository } from '../../../../../test/mocks/in-memory-user-repository';
import { fakeHashProvider } from '../../../../../test/mocks/mocks';
import { faker } from '@faker-js/faker';

const fakeStorageProvider = {
  uploadWorkImage: vi.fn(),
};

describe('UploadWorkImageUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let stu: UploadUserAvatarImage;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    stu = new UploadUserAvatarImage(inMemoryUserRepository, fakeStorageProvider);
    createUserUseCase = new CreateUserUseCase(fakeHashProvider, inMemoryUserRepository);
  });

  it('should be able to upload user avatar image', async () => {
    const userResult = await createUserUseCase.execute({
      name: faker.person.firstName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
    });

    const fakeImage = new ArrayBuffer(10);

    if (userResult.isLeft()) {
      throw new Error('User not created');
    }

    const results = await stu.execute({
      image: fakeImage,
      imageType: 'png',
      user_id: userResult.value.user.id.toString(),
    });

    expect(fakeStorageProvider.uploadWorkImage).toHaveBeenCalled();

    expect(results.isRight()).toBe(true);

    if (results.isRight()) {
      expect(results.value.user.avatarUrl).toBeDefined();
      expect(results.value.user.avatarUrl).includes('.png');
      expect(results.value.user.avatarUrl).includes(results.value.user.id.toString());
    }
  });
});
