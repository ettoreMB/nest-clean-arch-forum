import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notifications'

export class InMemoryNotificationsRepository implements NotificationRepository {
  public items: Notification[] = []
  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((item) => item.id.toString() === id)
    if (!notification) {
      return null
    }
    return notification
  }

  async save(notification: Notification) {
    const indexAnswer = this.items.findIndex(
      (item) => item.id === notification.id,
    )

    this.items[indexAnswer] = notification
  }

  async create(notification: Notification) {
    this.items.push(notification)
  }
}
