import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeteleQuestionCommentUseCases } from './delete-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repositories'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

let sut: DeteleQuestionCommentUseCases
let repository: InMemoryQuestionCommentsRepository

describe('Delete question comment', async () => {
  beforeEach(() => {
    repository = new InMemoryQuestionCommentsRepository()
    sut = new DeteleQuestionCommentUseCases(repository)
  })

  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await repository.create(newQuestionComment)

    await sut.execute({
      authorId: 'author-1',
      questionCommentId: newQuestionComment.id.toString() as string,
    })

    expect(repository.items).toHaveLength(0)
  })

  it('should not be able to delete a question comment from another user', async () => {
    const newQuestionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await repository.create(newQuestionComment)

    const result = await sut.execute({
      authorId: 'author-2',
      questionCommentId: newQuestionComment.id.toString() as string,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
