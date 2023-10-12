import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'

import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notifications'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.slug(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return notification
}
