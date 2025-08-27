import { FetchQuestionAnswersUseCases } from './fetch-question-answers'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repositories'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachment-repository'

let sut: FetchQuestionAnswersUseCases
let repository: InMemoryAnswersRepository
let answerAttachmentRepository: InMemoryAnswerAttachmentsRepository

describe('Fetch answers by question', async () => {
  beforeEach(() => {
    answerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
    repository = new InMemoryAnswersRepository(answerAttachmentRepository)
    sut = new FetchQuestionAnswersUseCases(repository)
  })

  it('should be able to get answers by question', async () => {
    const answer1 = makeAnswer({
      questionId: new UniqueEntityId('question-1'),
    })
    const answer2 = makeAnswer({
      questionId: new UniqueEntityId('question-1'),
    })
    const answer3 = makeAnswer({
      questionId: new UniqueEntityId('question-1'),
    })

    await repository.create(answer1)
    await repository.create(answer2)
    await repository.create(answer3)

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
      pageSize: 20,
    })

    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to get paginated answers', async () => {
    for (let index = 0; index < 22; index++) {
      const answer = makeAnswer({
        questionId: new UniqueEntityId('question-1'),
      })
      await repository.create(answer)
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
      pageSize: 20,
    })

    expect(result.value?.answers).toHaveLength(2)
  })
})
