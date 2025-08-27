import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerQuestionUseCases } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repositories'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachment-repository'

let sut: AnswerQuestionUseCases
let repository: InMemoryAnswersRepository
let answerAttachementRepository: InMemoryAnswerAttachmentsRepository

describe('Answer question', async () => {
  beforeEach(() => {
    answerAttachementRepository = new InMemoryAnswerAttachmentsRepository()
    repository = new InMemoryAnswersRepository(answerAttachementRepository)
    sut = new AnswerQuestionUseCases(repository)
  })

  it('should be able to answer a question', async () => {
    const result = await sut.execute({
      instructorId: '1',
      QuestionId: '1',
      content: 'Conteúdo da resposta',
      attachmentsIds: ['1', '2'],
    })
    expect(result.isRight()).toBe(true)
    expect(repository.items[0].id).toEqual(result?.value?.answer.id)
    expect(repository.items[0].attachments.currentItems).toHaveLength(2)
    expect(repository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })
})
