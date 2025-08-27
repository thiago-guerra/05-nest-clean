import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { IAnswerAttachmentListRepository } from '@/domain/forum/application/repositories/answer-attachments-list-repository'
import { IAnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements IAnswersRepository {
  /**
   *
   */
  constructor(
    private answerAttachmentsRepository: IAnswerAttachmentListRepository,
  ) {}

  public items: Answer[] = []
  async findManyByQuestionId(
    questionId: string,
    props: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((props.page - 1) * props.pageSize, props.page * props.pageSize)
    return answers
  }

  async save(answer: Answer): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    )

    if (index > -1) {
      this.items[index] = answer
      DomainEvents.dispatchEventsForAggregate(answer.id)
    }
  }

  async findById(id: string): Promise<Answer | null> {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id)

    if (index > -1) {
      this.items.splice(index, 1)
      this.answerAttachmentsRepository.deleteManyByAnswerId(id)
    }
  }

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
}
