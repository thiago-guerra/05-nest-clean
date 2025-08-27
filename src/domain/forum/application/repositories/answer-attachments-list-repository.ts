import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export interface IAnswerAttachmentListRepository {
  findManyByAnswerAttachmentId(answerId: string): Promise<AnswerAttachment[]>
  deleteManyByAnswerId(answerId: string): Promise<void>
}
