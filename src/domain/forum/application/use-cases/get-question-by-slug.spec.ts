import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.-repositories'
import { GetQuestionBySlugUseCases } from './get-question-by-slug'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository'

let sut: GetQuestionBySlugUseCases
let repository: InMemoryQuestionsRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentsRepository

describe('Get Question', async () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentsRepository()
    repository = new InMemoryQuestionsRepository(questionAttachmentRepository)
    sut = new GetQuestionBySlugUseCases(repository)
  })

  it('should be able to get a question by slug', async () => {
    const questionIn = makeQuestion({
      slug: Slug.create('nova-pergunta'),
    })

    await repository.create(questionIn)

    const result = await sut.execute({
      slug: 'nova-pergunta',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.question.slug.value).toEqual(questionIn.slug.value)
  })
})
