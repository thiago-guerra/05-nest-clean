import { CommentOnAnswerUseCases } from './comment-on-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repositories'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repositories'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachment-repository'

let sut: CommentOnAnswerUseCases
let answerRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let answerAttachementRepository: InMemoryAnswerAttachmentsRepository

describe('Comment on answer', async () => {
  beforeEach(() => {
    answerAttachementRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(
      answerAttachementRepository,
    )
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCases(
      answerRepository,
      answerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await answerRepository.create(answer)

    const result = await sut.execute({
      authorId: '1',
      content: 'Conteúdo do comentário',
      answerId: answer.id.toString() as string,
    })

    expect(result.isRight()).toBe(true)
    expect(answerCommentsRepository.items[0].content).toEqual(
      'Conteúdo do comentário',
    )
  })
})
