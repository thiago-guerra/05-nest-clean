import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { IQuestionRepository } from '../repositories/questions-repository'
import { IQuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'

interface ICommentOnQuestionUseCases {
  authorId: string
  questionId: string
  content: string
}

type ICommentOnQuestionUseCasesResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>
export class CommentOnQuestionUseCases {
  constructor(
    private createQuestionRepository: IQuestionRepository,
    private questionComments: IQuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    content,
    questionId,
  }: ICommentOnQuestionUseCases): Promise<ICommentOnQuestionUseCasesResponse> {
    const question = await this.createQuestionRepository.findById(questionId)

    if (!question) return left(new ResourceNotFoundError())

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content,
    })

    await this.questionComments.create(questionComment)

    return right({ questionComment })
  }
}
