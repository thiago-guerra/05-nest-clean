import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AnswerAttachmentList } from './answer-attachment-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { AnswerCreatedEvent } from '../events/answer-created-event'

export interface AnswerProps {
  content: string
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  attachements: AnswerAttachmentList
  createdAt: Date
  updatedAt?: Date
}
export class Answer extends AggregateRoot<AnswerProps> {
  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachements'>,
    id?: UniqueEntityId,
  ) {
    const answer = new Answer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        attachements: props.attachements ?? new AnswerAttachmentList(),
      },
      id,
    )
    const isNewAnswer = !id

    if (isNewAnswer) answer.addDomainEvent(new AnswerCreatedEvent(answer))
    return answer
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get authorId() {
    return this.props.authorId
  }

  get attachments() {
    return this.props.attachements
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachements = attachments
    this.touch()
  }

  get questionId() {
    return this.props.questionId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
