import { Question } from '../../enterprise/entities/question'
import { IQuestionRepository } from '../repositories/questions-repository'
import { IAnswersRepository } from '../repositories/answers-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

interface IChooseQuestionBestAnswerUseCases {
  authorId: string
  answerId: string
}

type IChooseQuestionBestAnswerUseCasesResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class ChooseQuestionBestAnswerUseCases {
  constructor(
    private questionRepository: IQuestionRepository,
    private answerRepository: IAnswersRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: IChooseQuestionBestAnswerUseCases): Promise<IChooseQuestionBestAnswerUseCasesResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) return left(new ResourceNotFoundError())

    const question = await this.questionRepository.findById(
      answer.questionId.toString() as string,
    )

    if (!question) return left(new ResourceNotFoundError())

    if (question.authorId.toString() !== authorId)
      return left(new NotAllowedError())

    question.bestAnswerId = answer.id

    await this.questionRepository.save(question)

    return right({ question })
  }
}
