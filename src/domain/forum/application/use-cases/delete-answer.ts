import { Either, left, right } from '@/core/either'
import { IAnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

interface IDeleteAnswerUseCases {
  answerId: string
  authorId: string
}

type IDeleteAnswerUseCasesResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>
export class DeteleAnswerUseCases {
  constructor(private answerRepository: IAnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: IDeleteAnswerUseCases): Promise<IDeleteAnswerUseCasesResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) return left(new ResourceNotFoundError())

    if (answer.authorId.toString() !== authorId)
      return left(new NotAllowedError())

    await this.answerRepository.delete(answerId)
    return right(null)
  }
}
