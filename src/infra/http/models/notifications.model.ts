import { Notification } from '@domain/notifications/enterprise/entities/notifications';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

const notificationSchema = z.object({
  content: z.string().transform((value) => JSON.parse(value)),
  createdAt: z.date().transform((value) => value.toISOString()),
  id: z.string(),
  readAt: z.string().or(z.date()).nullable(),
});

export type NotificationHttpType = z.infer<typeof notificationSchema>;

export class NotificationHttp implements NotificationHttpType {
  @ApiProperty()
  content: {
    chapter: number;
    name: string;
  };

  @ApiProperty()
  id: string;

  @ApiProperty()
  readAt: string;
}

export class NotificationsModel {
  static toList(notifications: Notification[]): NotificationHttpType[] {
    return z.array(notificationSchema).parse(notifications);
  }
}
