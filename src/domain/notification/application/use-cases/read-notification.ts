import { Either, left, right } from '@/core/either'
import { NotificationRepository } from '../repositories/notification-repository'
import { Notification } from '../../enterprise/entities/notifications'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

export interface ReadNotificationUseCaseRequest {
  notificationId: string
  recipientId: string
}
export type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>
export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationRepository) {}

  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError())
    }
    notification.read()

    await this.notificationsRepository.save(notification)

    return right({ notification })
  }
}
