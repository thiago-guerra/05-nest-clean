import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repositories'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCases } from './fetch-recent-questions'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository'

let sut: FetchRecentQuestionsUseCases
let repository: InMemoryQuestionsRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentsRepository

describe('Recent Questions', async () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentsRepository()
    repository = new InMemoryQuestionsRepository(questionAttachmentRepository)
    sut = new FetchRecentQuestionsUseCases(repository)
  })

  it('should be able to get recent questions sorted', async () => {
    const question1 = makeQuestion({
      createdAt: new Date(2022, 0, 20),
    })
    const question2 = makeQuestion({
      createdAt: new Date(2022, 0, 21),
    })
    const question3 = makeQuestion({
      createdAt: new Date(2022, 0, 22),
    })

    await repository.create(question1)
    await repository.create(question2)
    await repository.create(question3)

    const result = await sut.execute({
      page: 1,
      pageSize: 20,
    })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 22) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 21) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
    ])
  })

  it('should be able to get recent questions paginated', async () => {
    for (let index = 0; index < 22; index++) {
      const question = makeQuestion()
      await repository.create(question)
    }

    const result = await sut.execute({
      page: 2,
      pageSize: 20,
    })

    expect(result.value?.questions).toHaveLength(2)
  })
})
