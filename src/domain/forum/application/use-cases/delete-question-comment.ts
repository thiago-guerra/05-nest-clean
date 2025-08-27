import { Either, left, right } from '@/core/either'
import { IQuestionCommentsRepository } from '../repositories/question-comments-repository'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

interface IDeleteQuestionCommentUseCases {
  questionCommentId: string
  authorId: string
}

type IDeleteQuestionCommentUseCasesResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>
export class DeteleQuestionCommentUseCases {
  constructor(private questionCommentRepository: IQuestionCommentsRepository) {}

  async execute({
    questionCommentId,
    authorId,
  }: IDeleteQuestionCommentUseCases): Promise<IDeleteQuestionCommentUseCasesResponse> {
    const questionComment =
      await this.questionCommentRepository.findById(questionCommentId)

    if (!questionComment) return left(new ResourceNotFoundError())

    if (questionComment.authorId.toString() !== authorId)
      return left(new NotAllowedError())

    await this.questionCommentRepository.delete(questionCommentId)

    return right(null)
  }
}
