import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { IQuestionRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { IQuestionAttachmentListRepository } from '../repositories/question-attachment-list-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

interface IEditQuestionUseCases {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type IEditQuestionUseCasesResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>
export class EditQuestionUseCases {
  constructor(
    private editQuestionRepository: IQuestionRepository,
    private questionAttachmentsRepository: IQuestionAttachmentListRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: IEditQuestionUseCases): Promise<IEditQuestionUseCasesResponse> {
    const question = await this.editQuestionRepository.findById(questionId)

    if (!question) return left(new ResourceNotFoundError())

    if (question.authorId.toString() !== authorId)
      return left(new NotAllowedError())

    const currentAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionAttachmentId(
        questionId,
      )

    const questionAttachmentList = new QuestionAttachmentList(
      currentAttachments,
    )

    const questionAttachment = attachmentsIds?.map((attachmentsIds) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentsIds),
        questionId: question.id,
      })
    })

    questionAttachmentList.update(questionAttachment)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentList

    await this.editQuestionRepository.save(question)

    return right({ question })
  }
}
