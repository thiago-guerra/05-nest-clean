import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'

export abstract class IQuestionRepository {
  abstract create(question: Question): Promise<void>
  abstract getBySlug(slug: string): Promise<Question | null>
  abstract findById(id: string): Promise<Question | null>
  abstract deleteById(id: string): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract findManyQuestions(props: PaginationParams): Promise<Question[]>
}
