import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.-repositories'
import { EditQuestionUseCases } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let sut: EditQuestionUseCases
let repository: InMemoryQuestionsRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentsRepository

describe('Edit question', async () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentsRepository()
    repository = new InMemoryQuestionsRepository(questionAttachmentRepository)
    sut = new EditQuestionUseCases(repository, questionAttachmentRepository)
  })

  it('should be able to edit a question', async () => {
    const questionIn = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await repository.create(questionIn)

    questionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: questionIn.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: questionIn.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    const result = await sut.execute({
      authorId: 'author-1',
      questionId: questionIn.id.toString() as string,
      title: 'Nova atualização de uma pergunta',
      content: 'Conteúdo da pergunta atualizado',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(repository.items[0]).toMatchObject({
      title: 'Nova atualização de uma pergunta',
      content: 'Conteúdo da pergunta atualizado',
    })
    expect(repository.items[0].attachments.currentItems).toHaveLength(2)
    expect(repository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })
})
