import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repositories'
import { CreateQuestionUseCases } from './create-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository'

let sut: CreateQuestionUseCases
let repository: InMemoryQuestionsRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentsRepository

describe('Create question', async () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentsRepository()
    repository = new InMemoryQuestionsRepository(questionAttachmentRepository)
    sut = new CreateQuestionUseCases(repository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Nova pergunta',
      content: 'Conteúdo da pergunta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(repository.items[0].id).toEqual(result?.value?.question.id)
    expect(repository.items[0].attachments.currentItems).toHaveLength(2)
    expect(repository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })
})
