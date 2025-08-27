import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { IAnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../../enterprise/entities/answer'
import { Either, right } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
interface IAnswerQuestionUseCases {
  instructorId: string
  QuestionId: string
  content: string
  attachmentsIds: string[]
}
type AnswerQuestionUseCasesResponse = Either<null, { answer: Answer }>

export class AnswerQuestionUseCases {
  constructor(private answersRepository: IAnswersRepository) {
    this.answersRepository = answersRepository
  }

  async execute({
    instructorId,
    QuestionId,
    content,
    attachmentsIds,
  }: IAnswerQuestionUseCases): Promise<AnswerQuestionUseCasesResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(QuestionId),
    })

    const attachments = attachmentsIds?.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      })
    })

    const answerAttachmentsList = new AnswerAttachmentList(attachments)
    answerAttachmentsList.update(attachments)

    answer.attachments = answerAttachmentsList

    await this.answersRepository.create(answer)
    return right({ answer })
  }
}
