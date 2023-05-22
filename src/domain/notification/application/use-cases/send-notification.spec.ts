import { SendNotificationProvider } from '@domain/notification/application/providers/send-notification-provider';
import { InMemoryNotificationRepository } from 'test/mocks/in-mermory-notification-repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { SendNotificationUseCase } from './send-notification';

const fakeSendNotificationProvider: SendNotificationProvider = {
  send: vi.fn(),
};

describe('Send Notification', () => {
  let stu: SendNotificationUseCase;
  let sendNotificationProvider: SendNotificationProvider;
  let notificationRepository: NotificationRepository;

  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    sendNotificationProvider = fakeSendNotificationProvider;
    stu = new SendNotificationUseCase(
      notificationRepository,
      sendNotificationProvider,
    );
  });

  it('should be able to create a notification', async () => {
    const notificationInput = {
      content: "Novo capitulo de 'One Piece' disponível",
      recipientId: '1',
    };

    const { notification: notificationCreated } = await stu.execute(
      notificationInput,
    );

    expect(notificationCreated.id.toString()).toBeTruthy();
    expect(notificationCreated.content.toString()).toBe(
      notificationInput.content,
    );
    expect(notificationCreated.recipientId).toBe(notificationInput.recipientId);
    expect(notificationCreated.createdAt).toBeTruthy();
    expect(notificationCreated.readAt).toBeNull();
  });

  it('should be able to send a notification', async () => {
    const notificationInput = {
      content: "Novo capitulo de 'One Piece' disponível",
      recipientId: '1',
    };

    const spy = vi.spyOn(sendNotificationProvider, 'send');

    await stu.execute(notificationInput);

    expect(spy.mock.calls.length).toBe(1);
  });
});
