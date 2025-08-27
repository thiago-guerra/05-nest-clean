import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeteleAnswerCommentUseCases } from './delete-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repositories'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

let sut: DeteleAnswerCommentUseCases
let repository: InMemoryAnswerCommentsRepository

describe('Delete answer comment', async () => {
  beforeEach(() => {
    repository = new InMemoryAnswerCommentsRepository()
    sut = new DeteleAnswerCommentUseCases(repository)
  })

  it('should be able to delete a answer comment', async () => {
    const newAnswerComment = makeAnswerComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await repository.create(newAnswerComment)

    await sut.execute({
      authorId: 'author-1',
      answerCommentId: newAnswerComment.id.toString() as string,
    })

    expect(repository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer comment from another user', async () => {
    const newAnswerComment = makeAnswerComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await repository.create(newAnswerComment)

    const result = await sut.execute({
      authorId: 'author-2',
      answerCommentId: newAnswerComment.id.toString() as string,
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
