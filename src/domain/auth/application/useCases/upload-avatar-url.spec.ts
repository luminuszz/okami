import { UploadUserAvatarImage } from '@domain/auth/application/useCases/upload-user-avatar-image';
import { CreateUserUseCase } from '@domain/auth/application/useCases/create-user';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { fakeHashProvider, fakeStorageProvider } from '@test/mocks/mocks';
import { faker } from '@faker-js/faker';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';

describe('UploadWorkImageUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let stu: UploadUserAvatarImage;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    stu = new UploadUserAvatarImage(inMemoryUserRepository, fakeStorageProvider);
    createUserUseCase = new CreateUserUseCase(fakeHashProvider, inMemoryUserRepository);

    jest.clearAllMocks();
  });

  it('should be able to upload user avatar image', async () => {
    const spy = jest.spyOn(inMemoryUserRepository, 'save');

    const userResult = await createUserUseCase.execute({
      name: faker.person.firstName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
    });

    const fakeImage = new ArrayBuffer(10);

    if (userResult.isLeft()) {
      throw new Error('User not created');
    }

    fakeStorageProvider.uploadAvatarImage.mockResolvedValueOnce({
      fileType: 'png',
      fileName: userResult.value.user.id,
    });

    const results = await stu.execute({
      image: fakeImage,
      imageType: 'png',
      user_id: userResult.value.user.id.toString(),
    });

    expect(fakeStorageProvider.uploadAvatarImage).toHaveBeenCalled();

    expect(results.isRight()).toBe(true);

    if (results.isRight()) {
      expect(results.value.user.avatarImageId).toBeDefined();
      expect(results.value.user.avatarImageId.includes('.png')).toBe(true);

      console.log({ results: results.value.user.avatarImageId, user: results.value.user.id.toString() });

      expect(results.value.user.avatarImageId.includes(results.value.user.id.toString())).toBeTruthy();
      expect(spy).toHaveBeenCalled();
    }
  });

  it('should not be able to upload user avatar image if user not exists', async () => {
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
      user_id: 'FAKE_ID',
    });

    expect(results.isLeft()).toBe(true);
    expect(results.value).toBeInstanceOf(UserNotFound);
  });
});
