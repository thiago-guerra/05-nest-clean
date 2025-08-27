import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export interface IQuestionAttachmentListRepository {
  findManyByQuestionAttachmentId(
    questionId: string,
  ): Promise<QuestionAttachment[]>
  deleteManyByQuestionId(questionId: string): Promise<void>
}
