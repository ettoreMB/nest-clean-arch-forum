import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificantionsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase
describe('read notificanton test', () => {
  beforeEach(() => {
    inMemoryNotificantionsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificantionsRepository)
  })

  test('should read notification', async () => {
    const notification = makeNotification()
    await inMemoryNotificantionsRepository.create(notification)
    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryNotificantionsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })
  test('should not read notification from another user', async () => {
    const notification = makeNotification()
    await inMemoryNotificantionsRepository.create(notification)
    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: '1',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
