import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.-repositories'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ChooseQuestionBestAnswerUseCases } from './choose-question-best-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repositories'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachment-repository'

let sut: ChooseQuestionBestAnswerUseCases
let questionRepository: InMemoryQuestionsRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let answerAttachementRepository: InMemoryAnswerAttachmentsRepository
let answerRepository: InMemoryAnswersRepository

describe('Best answer', async () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentsRepository()
    answerAttachementRepository = new InMemoryAnswerAttachmentsRepository()
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentRepository,
    )
    answerRepository = new InMemoryAnswersRepository(
      answerAttachementRepository,
    )
    sut = new ChooseQuestionBestAnswerUseCases(
      questionRepository,
      answerRepository,
    )
  })

  it('should be able to choose the best answer', async () => {
    const questionIn = makeQuestion({
      authorId: new UniqueEntityId('author-1'),
    })

    const answerIn = makeAnswer({
      questionId: questionIn.id,
    })

    await questionRepository.create(questionIn)
    await answerRepository.create(answerIn)

    const result = await sut.execute({
      authorId: 'author-1',
      answerId: answerIn.id.toString() as string,
    })

    expect(result.isRight()).toBe(true)
    expect(questionRepository.items[0].bestAnswerId).toEqual(answerIn.id)
  })

  it('should not be able to choose the best answer from another user', async () => {
    const questionIn = makeQuestion({
      authorId: new UniqueEntityId('author-1'),
    })

    const answerIn = makeAnswer({
      questionId: questionIn.id,
    })

    await questionRepository.create(questionIn)
    await answerRepository.create(answerIn)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: answerIn.id.toString() as string,
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
