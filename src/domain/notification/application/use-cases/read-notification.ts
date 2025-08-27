import { Either, left, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { INotificationsRepository } from '../repositories/notifications-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface IReadNotificationUseCases {
  recipientId: string
  notificationId: string
}

type IReadNotificationUseCasesResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>
export class ReadNotificationUseCases {
  constructor(private notificationRepository: INotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: IReadNotificationUseCases): Promise<IReadNotificationUseCasesResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError())
    }

    notification.read()

    await this.notificationRepository.save(notification)

    return right({ notification })
  }
}
