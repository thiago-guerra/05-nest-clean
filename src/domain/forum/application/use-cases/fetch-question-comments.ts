import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { IQuestionCommentsRepository } from '../repositories/question-comments-repository'

interface IFetchQuestionCommentsUseCases {
  questionId: string
  page: number
  pageSize: number
}

type IFetchQuestionCommentsUseCasesResponse = Either<
  null,
  {
    questionComments: QuestionComment[]
  }
>
export class FetchQuestionCommentsUseCases {
  constructor(
    private questionCommentsRepository: IQuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    page,
    pageSize,
  }: IFetchQuestionCommentsUseCases): Promise<IFetchQuestionCommentsUseCasesResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
        pageSize,
      })

    return right({ questionComments })
  }
}
