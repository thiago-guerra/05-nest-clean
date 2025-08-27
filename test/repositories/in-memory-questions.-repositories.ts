import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { IQuestionAttachmentListRepository } from '@/domain/forum/application/repositories/question-attachment-list-repository'
import { IQuestionRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements IQuestionRepository {
  constructor(
    private inMemoryQuestionAttachment: IQuestionAttachmentListRepository,
  ) {}

  public items: Question[] = []
  async findManyQuestions(props: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((props.page - 1) * props.pageSize, props.page * props.pageSize)
    return questions
  }

  async save(question: Question): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    )

    if (index > -1) {
      this.items[index] = question
      DomainEvents.dispatchEventsForAggregate(question.id)
    }
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async deleteById(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id)

    if (index > -1) {
      this.items.splice(index, 1)
      await this.inMemoryQuestionAttachment.deleteManyByQuestionId(id)
    }
  }

  async getBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async create(question: Question): Promise<void> {
    this.items.push(question)
    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
