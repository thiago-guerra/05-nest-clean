import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface IQuestionCommentsRepository {
  create(comment: QuestionComment): Promise<void>
  findById(id: string): Promise<QuestionComment | null>
  delete(id: string): Promise<void>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
}
