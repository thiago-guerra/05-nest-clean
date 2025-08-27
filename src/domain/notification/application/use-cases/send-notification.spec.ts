import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repositories'
import { SendNotificationUseCases } from './send-notification'

let sut: SendNotificationUseCases
let repository: InMemoryNotificationsRepository

describe('send notification', () => {
  beforeAll(() => {
    repository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCases(repository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: 'example-recipient-id',
      title: 'Nova notificação',
      content: 'Conteúdo da notificação',
    })

    expect(result.value).toBeTruthy()
    expect(repository.items[0]).toEqual(result.value?.notification)
  })
})
