import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { IAnswerCommentsRepository } from '../repositories/answer-comments-respository'

interface IFetchAnswerCommentsUseCases {
  answerId: string
  page: number
  pageSize: number
}

type IFetchAnswerCommentsUseCasesResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>
export class FetchAnswerCommentsUseCases {
  constructor(private answerCommentsRepository: IAnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
    pageSize,
  }: IFetchAnswerCommentsUseCases): Promise<IFetchAnswerCommentsUseCasesResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
        pageSize,
      })

    return right({ answerComments })
  }
}
