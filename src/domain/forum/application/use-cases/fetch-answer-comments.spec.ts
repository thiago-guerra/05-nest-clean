import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCases } from './fetch-answer-comments'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repositories'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let sut: FetchAnswerCommentsUseCases
let repository: InMemoryAnswerCommentsRepository

describe('Fetch answer comments', async () => {
  beforeEach(() => {
    repository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCases(repository)
  })

  it('should be able to get comments by answer', async () => {
    const answerComment1 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
    })
    const answerComment2 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
    })
    const answerComment3 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
    })

    await repository.create(answerComment1)
    await repository.create(answerComment2)
    await repository.create(answerComment3)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
      pageSize: 20,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should no be able to get comments paginated', async () => {
    for (let index = 0; index < 22; index++) {
      const answer = makeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
      })
      await repository.create(answer)
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
      pageSize: 20,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
