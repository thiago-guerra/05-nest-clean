import { IQuestionAttachmentListRepository } from '@/domain/forum/application/repositories/question-attachment-list-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements IQuestionAttachmentListRepository
{
  public items: QuestionAttachment[] = []
  async deleteManyByQuestionId(questionId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )
  }

  async findManyByQuestionAttachmentId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachment = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )
    return questionAttachment
  }
}
