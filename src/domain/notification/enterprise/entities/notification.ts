import { BaseEntity } from '@/core/entities/baseEntity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface NotificationProps {
  content: string
  recipientId: UniqueEntityId
  title: string
  readAt?: Date
  createdAt?: Date
}

export class Notification extends BaseEntity<NotificationProps> {
  get content() {
    return this.props.content
  }

  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  get readAt() {
    return this.props.readAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  read() {
    this.props.readAt = new Date()
  }

  static create(props: NotificationProps, id?: UniqueEntityId) {
    return new Notification(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    )
  }
}
