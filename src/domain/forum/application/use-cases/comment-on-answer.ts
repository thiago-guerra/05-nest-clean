import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { IAnswersRepository } from '../repositories/answers-repository'
import { IAnswerCommentsRepository } from '../repositories/answer-comments-respository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'

interface ICommentOnAnswerUseCases {
  authorId: string
  answerId: string
  content: string
}

type ICommentOnAnswerUseCasesResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>
export class CommentOnAnswerUseCases {
  constructor(
    private createAnswerRepository: IAnswersRepository,
    private answerComments: IAnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    content,
    answerId,
  }: ICommentOnAnswerUseCases): Promise<ICommentOnAnswerUseCasesResponse> {
    const answer = await this.createAnswerRepository.findById(answerId)

    if (!answer) return left(new ResourceNotFoundError())

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    })

    await this.answerComments.create(answerComment)

    return right({ answerComment })
  }
}
