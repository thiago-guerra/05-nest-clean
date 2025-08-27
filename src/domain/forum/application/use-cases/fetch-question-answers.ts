import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { IAnswersRepository } from '../repositories/answers-repository'

interface IFetchQuestionAnswersUseCases {
  questionId: string
  page: number
  pageSize: number
}

type IFetchQuestionAnswersUseCasesResponse = Either<
  null,
  {
    answers: Answer[]
  }
>
export class FetchQuestionAnswersUseCases {
  constructor(private answersRepository: IAnswersRepository) {}

  async execute({
    questionId,
    page,
    pageSize,
  }: IFetchQuestionAnswersUseCases): Promise<IFetchQuestionAnswersUseCasesResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
        pageSize,
      },
    )

    return right({ answers })
  }
}
