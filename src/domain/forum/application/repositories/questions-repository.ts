import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'

export interface IQuestionRepository {
  create(question: Question): Promise<void>
  getBySlug(slug: string): Promise<Question | null>
  findById(id: string): Promise<Question | null>
  deleteById(id: string): Promise<void>
  save(question: Question): Promise<void>
  findManyQuestions(props: PaginationParams): Promise<Question[]>
}
