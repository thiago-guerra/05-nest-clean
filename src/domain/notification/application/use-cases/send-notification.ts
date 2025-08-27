import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { INotificationsRepository } from '../repositories/notifications-repository'

export interface ISendNotificationUseCasesRequest {
  recipientId: string
  title: string
  content: string
}

export type ISendNotificationUseCasesResponse = Either<
  null,
  {
    notification: Notification
  }
>
export class SendNotificationUseCases {
  constructor(private notificationRepository: INotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: ISendNotificationUseCasesRequest): Promise<ISendNotificationUseCasesResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    })

    await this.notificationRepository.create(notification)

    return right({ notification })
  }
}
