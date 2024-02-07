import { NotificationType } from '@domain/notification/enterprise/entities/user-notification-subscription';
import { CreateUserNotificationSubscriptionUseCase } from './create-user-notification-subscription';
import { faker } from '@faker-js/faker';
import { InMemoryUserNotificationSubscriptionRepository } from '@test/mocks/in-memory-user-notification-subscription';
import { FetchUserNotificationSubscriptionUseCase } from './fetch-user-notification-subscription-by-userId';

describe('CreateUserNotificationSubscriptionUseCase', () => {
  let createUserNotificationSubscription: CreateUserNotificationSubscriptionUseCase;
  let userNotificationSubscriptionRepository: InMemoryUserNotificationSubscriptionRepository;
  let stu: FetchUserNotificationSubscriptionUseCase;

  beforeEach(() => {
    userNotificationSubscriptionRepository = new InMemoryUserNotificationSubscriptionRepository();
    createUserNotificationSubscription = new CreateUserNotificationSubscriptionUseCase(
      userNotificationSubscriptionRepository,
    );
    stu = new FetchUserNotificationSubscriptionUseCase(userNotificationSubscriptionRepository);
  });

  it('should be able to be able to fetch all subscribers by user_id', async () => {
    const userId = faker.string.uuid();

    for (let i = 0; i < 5; i++) {
      await createUserNotificationSubscription.execute({
        userId,
        notificationType: NotificationType.BROWSER,
        subscriptionId: faker.string.uuid(),
      });
    }

    const result = await stu.execute({ userId });

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value).toHaveLength(5);
    }
  });
});
