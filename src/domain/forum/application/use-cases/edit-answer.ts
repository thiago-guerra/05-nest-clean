import { Either, left, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { IAnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { IAnswerAttachmentListRepository } from '../repositories/answer-attachments-list-repository'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface IEditAnswerUseCases {
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}

type IEditAnswerUseCasesResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    answer: Answer
  }
>
export class EditAnswerUseCases {
  constructor(
    private editAnswerRepository: IAnswersRepository,
    private answerAttachementRepository: IAnswerAttachmentListRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds,
  }: IEditAnswerUseCases): Promise<IEditAnswerUseCasesResponse> {
    const answer = await this.editAnswerRepository.findById(answerId)

    if (!answer) return left(new ResourceNotFoundError())

    if (answer.authorId.toString() !== authorId)
      return left(new NotAllowedError())

    const currentAttachments =
      await this.answerAttachementRepository.findManyByAnswerAttachmentId(
        answerId,
      )

    const answerAttachmentList = new AnswerAttachmentList(currentAttachments)

    const answerAttachment = attachmentsIds?.map((attachmentsIds) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentsIds),
        answerId: answer.id,
      })
    })

    answerAttachmentList.update(answerAttachment)

    answer.content = content
    answer.attachments = answerAttachmentList

    await this.editAnswerRepository.save(answer)

    return right({ answer })
  }
}
