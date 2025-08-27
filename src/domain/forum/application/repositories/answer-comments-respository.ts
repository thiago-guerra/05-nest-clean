import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface IAnswerCommentsRepository {
  create(comment: AnswerComment): Promise<void>
  findById(id: string): Promise<AnswerComment | null>
  delete(id: string): Promise<void>
  findManyByAnswerId(
    answerId: string,
    props: PaginationParams,
  ): Promise<AnswerComment[]>
}
