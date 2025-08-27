import { Either, left, right } from '@/core/either'
import { IAnswerCommentsRepository } from '../repositories/answer-comments-respository'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

interface IDeleteAnswerCommentUseCases {
  answerCommentId: string
  authorId: string
}

type DeleteAnswerCommentUseCasesResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>
export class DeteleAnswerCommentUseCases {
  constructor(private answerCommentRepository: IAnswerCommentsRepository) {}

  async execute({
    answerCommentId,
    authorId,
  }: IDeleteAnswerCommentUseCases): Promise<DeleteAnswerCommentUseCasesResponse> {
    const answerComment =
      await this.answerCommentRepository.findById(answerCommentId)

    if (!answerComment) return left(new ResourceNotFoundError())

    if (answerComment.authorId.toString() !== authorId)
      return left(new NotAllowedError())

    await this.answerCommentRepository.delete(answerCommentId)

    return right(null)
  }
}
