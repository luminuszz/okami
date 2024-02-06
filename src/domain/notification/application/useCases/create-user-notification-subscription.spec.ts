import { NotificationType } from '@domain/notification/enterprise/entities/user-notification-subscription';
import { CreateUserNotificationSubscriptionUseCase } from './create-user-notification-subscription';
import { faker } from '@faker-js/faker';
import { InMemoryUserNotificationSubscriptionRepository } from '@test/mocks/in-memory-user-notification-subscription';

describe('CreateUserNotificationSubscriptionUseCase', () => {
  let stu: CreateUserNotificationSubscriptionUseCase;
  let userNotificationSubscriptionRepository: InMemoryUserNotificationSubscriptionRepository;

  beforeEach(() => {
    userNotificationSubscriptionRepository = new InMemoryUserNotificationSubscriptionRepository();
    stu = new CreateUserNotificationSubscriptionUseCase(userNotificationSubscriptionRepository);
  });

  it('should be able to create a new userNotificationSubscriber', async () => {
    const result = await stu.execute({
      userId: faker.string.uuid(),
      notificationType: NotificationType.BROWSER,
      subscriptionId: faker.string.uuid(),
    });

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value).toHaveProperty('id');
      expect(result.value).toHaveProperty('createdAt');
      expect(result.value).toHaveProperty('subscriptionId');
      expect(result.value).toHaveProperty('userId');
    }
  });

  it('should be able to create a new userNotificationSubscriber', async () => {
    const result = await stu.execute({
      userId: faker.string.uuid(),
      notificationType: NotificationType.BROWSER,
      subscriptionId: faker.string.uuid(),
    });

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value).toHaveProperty('id');
      expect(result.value).toHaveProperty('createdAt');
      expect(result.value).toHaveProperty('subscriptionId');
      expect(result.value).toHaveProperty('userId');
    }

    expect(userNotificationSubscriptionRepository.userNotificationSubscriptions).toHaveLength(1);
  });
});
