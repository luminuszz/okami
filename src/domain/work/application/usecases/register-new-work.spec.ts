import { CreateUserUseCase } from "@domain/auth/application/useCases/create-user";
import { PaymentSubscriptionStatus } from "@domain/auth/enterprise/entities/User";
import { Category, Work } from "@domain/work/enterprise/entities/work";
import { faker } from "@faker-js/faker";
import { InMemoryUserRepository } from "@test/mocks/in-memory-user-repository";
import { InMemoryWorkRepository } from "@test/mocks/in-mermory-work-repository";
import { fakeHashProvider, fakeStorageProvider } from "@test/mocks/mocks";
import { InvalidWorkOperationError } from "./errors/invalid-work-operation";
import { RegisterNewWork } from "./register-new-work";
import { UploadWorkImageUseCase } from "./upload-work-image";

describe("RegisterNewWork", () => {
  let inMemoryWorkRepository: InMemoryWorkRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let stu: RegisterNewWork;
  let createUser: CreateUserUseCase;
  let uploadWorkImage: UploadWorkImageUseCase;

  beforeEach(() => {
    inMemoryWorkRepository = new InMemoryWorkRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    uploadWorkImage = new UploadWorkImageUseCase(fakeStorageProvider, inMemoryWorkRepository);

    stu = new RegisterNewWork(inMemoryWorkRepository, inMemoryUserRepository, uploadWorkImage);
    createUser = new CreateUserUseCase(fakeHashProvider, inMemoryUserRepository);
  });

  it("should create a work", async () => {
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
      name: "One Piece",
      url: "https://onepiece.com",
      userId: user.id,
    });

    if (response.isRight()) {
      const {
        value: { work },
      } = response;

      expect(work).toBeDefined();
      expect(work.category).toEqual(Category.MANGA);
      expect(work.chapter.getChapter()).toEqual(1);
      expect(work.name).toEqual("One Piece");
      expect(work.url).toEqual("https://onepiece.com");
    }
  });

  it("should not ble able to create a work if user no have trial quotes", async () => {
    const userResults = await createUser.execute({
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
    });

    if (userResults.isLeft()) throw userResults.value;

    const { user } = userResults.value;

    for (let i = 0; i < 5; i++) {
      user.decreaseTrialWorkLimit();
    }

    const response = await stu.execute({
      category: Category.MANGA,
      chapter: 1,
      name: "One Piece",
      url: "https://onepiece.com",
      userId: user.id,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidWorkOperationError);
  });

  it("should be able to create a work if user no have trial quotes but have active subscription", async () => {
    const userResults = await createUser.execute({
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
    });

    if (userResults.isLeft()) throw userResults.value;

    const { user } = userResults.value;

    for (let i = 0; i < 5; i++) {
      user.decreaseTrialWorkLimit();
    }

    user.paymentSubscriptionStatus = PaymentSubscriptionStatus.ACTIVE;

    const response = await stu.execute({
      category: Category.MANGA,
      chapter: 1,
      name: "One Piece",
      url: "https://onepiece.com",
      userId: user.id,
    });

    if (response.isRight()) {
      expect(response.isRight()).toBeTruthy();
      expect(response.value.work).toBeInstanceOf(Work);
      expect(response.value.work.name).toEqual("One Piece");
      expect(response.value.work.userId).toEqual(user.id);
    }
  });
});
