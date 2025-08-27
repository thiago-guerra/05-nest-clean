import { Either, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { IQuestionRepository } from '../repositories/questions-repository'

interface IFetchRecentQuestionsUseCases {
  page: number
  pageSize: number
}

type IFetchRecentQuestionsUseCasesResponse = Either<
  null,
  {
    questions: Question[]
  }
>
export class FetchRecentQuestionsUseCases {
  constructor(private createQuestionRepository: IQuestionRepository) {}

  async execute({
    page,
    pageSize,
  }: IFetchRecentQuestionsUseCases): Promise<IFetchRecentQuestionsUseCasesResponse> {
    const questions = await this.createQuestionRepository.findManyQuestions({
      page,
      pageSize,
    })

    return right({ questions })
  }
}
