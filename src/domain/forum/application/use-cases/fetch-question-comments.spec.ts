import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCases } from './fetch-question-comments'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repositories'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let sut: FetchQuestionCommentsUseCases
let repository: InMemoryQuestionCommentsRepository

describe('Fetch question comments', async () => {
  beforeEach(() => {
    repository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCases(repository)
  })

  it('should be able to get comments by question', async () => {
    const questionComment1 = makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
    })
    const questionComment2 = makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
    })
    const questionComment3 = makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
    })

    await repository.create(questionComment1)
    await repository.create(questionComment2)
    await repository.create(questionComment3)

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
      pageSize: 20,
    })

    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should no be able to get comments from another user', async () => {
    for (let index = 0; index < 22; index++) {
      const answer = makeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
      })
      await repository.create(answer)
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
      pageSize: 20,
    })

    expect(result.value?.questionComments).toHaveLength(2)
  })
})
