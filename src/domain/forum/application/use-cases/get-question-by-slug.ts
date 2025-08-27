import { Either, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { IQuestionRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'

interface IGetQuestionBySlugUseCases {
  slug: string
}

type IGetQuestionBySlugUseCasesResponse = Either<
  null,
  {
    question: Question
  }
>

export class GetQuestionBySlugUseCases {
  constructor(private createQuestionRepository: IQuestionRepository) {}

  async execute({
    slug,
  }: IGetQuestionBySlugUseCases): Promise<IGetQuestionBySlugUseCasesResponse> {
    const question = await this.createQuestionRepository.getBySlug(slug)

    if (!question) throw new ResourceNotFoundError()

    return right({ question })
  }
}
