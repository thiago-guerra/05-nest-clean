import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repositories'
import { CommentOnQuestionUseCases } from './comment-on-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repositories'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository'

let sut: CommentOnQuestionUseCases
let questionRepository: InMemoryQuestionsRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository

describe('Comment on question', async () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentRepository,
    )
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new CommentOnQuestionUseCases(
      questionRepository,
      questionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await questionRepository.create(question)

    await sut.execute({
      authorId: '1',
      content: 'Conteúdo do comentário',
      questionId: question.id.toString() as string,
    })

    expect(questionCommentsRepository.items[0].content).toEqual(
      'Conteúdo do comentário',
    )
  })
})
