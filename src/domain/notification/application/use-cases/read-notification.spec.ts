import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repositories'
import { ReadNotificationUseCases } from './read-notification'
import { makeNotification } from 'test/factories/make-notifications'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

let sut: ReadNotificationUseCases
let repository: InMemoryNotificationsRepository

describe('read notification', () => {
  beforeAll(() => {
    repository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCases(repository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()

    await repository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString() as string,
      notificationId: notification.id.toString() as string,
    })

    expect(result.isRight()).toBeTruthy()
    expect(repository.items[0].readAt).toEqual(expect.any(Date))
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('recipient-1'),
    })

    await repository.create(notification)

    const result = await sut.execute({
      recipientId: 'recipient-2',
      notificationId: notification.id.toString() as string,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
