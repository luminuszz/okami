import { ProvidersLabels, Notification } from '@domain/notifications/enterprise/entities/notifications';

export function can(provider: ProvidersLabels, notification: Notification) {
  return notification.providers.includes('all') || notification.providers.includes(provider);
}
