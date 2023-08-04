import { InMemoryNotificationRepository } from 'test/mocks/in-mermory-notification-repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { CreateNotificationUseCase } from './create-notification';

describe('Send Notification', () => {
  let stu: CreateNotificationUseCase;
  let notificationRepository: NotificationRepository;

  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();

    stu = new CreateNotificationUseCase(notificationRepository);
  });

  it('should be able to create a notification', async () => {
    const notificationInput = {
      content: "Novo capitulo de 'One Piece' disponível",
      recipientId: '1',
    };

    const response = await stu.execute(notificationInput);

    if (response.isRight()) {
      const { notification: notificationCreated } = response.value;

      expect(notificationCreated.id.toString()).toBeTruthy();
      expect(notificationCreated.content.toString()).toBe(notificationInput.content);
      expect(notificationCreated.recipientId).toBe(notificationInput.recipientId);
      expect(notificationCreated.createdAt).toBeTruthy();
      expect(notificationCreated.readAt).toBeNull();
    }
  });
});
