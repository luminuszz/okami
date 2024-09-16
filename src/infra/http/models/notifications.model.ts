import { Notification } from '@domain/notifications/enterprise/entities/notifications';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const notificationSchema = z.object({
  content: z.string().transform((value) => JSON.parse(value)),
  createdAt: z.date().transform((value) => value.toISOString()),
  id: z.string(),
  readAt: z.string().or(z.date()).nullable(),
});

export type NotificationHttpType = z.infer<typeof notificationSchema>;

export class NotificationHttp implements NotificationHttpType {
  @ApiProperty()
  content: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  readAt: Date | string | null;
}

export class NotificationsModel {
  static toList(notifications: Notification[]): NotificationHttpType[] {
    return z.array(notificationSchema).parse(notifications);
  }
}
