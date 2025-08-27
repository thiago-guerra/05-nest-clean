import { Either, left, right } from '@/core/either'
import { IQuestionRepository } from '../repositories/questions-repository'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'

interface IDeleteQuestionUseCases {
  questionId: string
  authorId: string
}

type IDeleteQuestionUseCasesResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>
export class DeteleQuestionUseCases {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute({
    questionId,
    authorId,
  }: IDeleteQuestionUseCases): Promise<IDeleteQuestionUseCasesResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) return left(new ResourceNotFoundError())

    if (question.authorId.toString() !== authorId)
      return left(new NotAllowedError())

    await this.questionRepository.deleteById(questionId)
    return right(null)
  }
}
