import { FetchRecentSubscriberNotifications } from '@domain/notifications/application/use-cases/fetch-recent-subscriber-notifications'
import { MarkNotificationAsRead } from '@domain/notifications/application/use-cases/mark-notification-as-read'
import { WorkMarkReadEvent } from '@domain/work/enterprise/entities/events/work-marked-read'
import { WorkContentObject } from '@infra/crqs/notification/handlers/dto'
import { Logger } from '@nestjs/common'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

@EventsHandler(WorkMarkReadEvent)
export class OnWorkMarkedReadNotificationEventHandler implements IEventHandler<WorkMarkReadEvent> {
  constructor(
    private fetchRecentSubscriberNotifications: FetchRecentSubscriberNotifications,
    private markNotificationAsRead: MarkNotificationAsRead,
  ) {}

  private logger = new Logger(OnWorkMarkedReadNotificationEventHandler.name)

  async handle({ payload: work }: WorkMarkReadEvent) {
    const lastNotifications = await this.fetchRecentSubscriberNotifications.execute({
      recipientId: work.userId,
    })

    if (lastNotifications.isLeft()) {
      throw lastNotifications.value
    }

    const { notifications } = lastNotifications.value

    this.logger.debug(`Found ${notifications.length} notifications for user ${work.recipientId}`)

    const notificationToMarkRead = notifications.find((item) => {
      const parseContent = JSON.parse(item.content) as WorkContentObject
      return parseContent.workId === work.id && parseContent.chapter === work.chapter.getChapter()
    })

    if (!notificationToMarkRead) {
      return
    }

    this.logger.debug(`Marking notification as read: ${notificationToMarkRead.id}`)

    const markNotificationResults = await this.markNotificationAsRead.execute({
      notificationId: notificationToMarkRead.id,
    })

    if (markNotificationResults.isLeft()) {
      throw markNotificationResults.value
    }
  }
}
