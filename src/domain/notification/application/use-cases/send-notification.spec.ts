import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationsRepository } from '../../../../../test/repositories/in-memory-notifications-repository'
let inMemoryNotificantionsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('send notificanton test', () => {
  beforeEach(() => {
    inMemoryNotificantionsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificantionsRepository)
  })

  test('should send notificantion', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'new notification',
      content: 'notification content',
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryNotificantionsRepository.items).toHaveLength(1)
    expect(inMemoryNotificantionsRepository.items[0]).toEqual(
      result.value?.notification,
    )
  })
})
