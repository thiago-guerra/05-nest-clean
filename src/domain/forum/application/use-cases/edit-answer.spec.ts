import { EditAnswerUseCases } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repositories'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let sut: EditAnswerUseCases
let repository: InMemoryAnswersRepository
let answerAttachmentRepository: InMemoryAnswerAttachmentsRepository

describe('Edit answer', async () => {
  beforeEach(() => {
    answerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
    repository = new InMemoryAnswersRepository(answerAttachmentRepository)
    sut = new EditAnswerUseCases(repository, answerAttachmentRepository)
  })

  it('should be able to edit a answer', async () => {
    const answerIn = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await repository.create(answerIn)

    answerAttachmentRepository.items.push(
      makeAnswerAttachment({
        answerId: answerIn.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachment({
        answerId: answerIn.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    const result = await sut.execute({
      authorId: 'author-1',
      answerId: answerIn.id.toString() as string,
      content: 'Conteúdo da pergunta atualizado',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(repository.items[0]).toMatchObject({
      content: 'Conteúdo da pergunta atualizado',
    })

    expect(repository.items[0].attachments.currentItems).toHaveLength(2)
    expect(repository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })
})
