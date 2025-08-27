import { IAnswerAttachmentListRepository } from '@/domain/forum/application/repositories/answer-attachments-list-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements IAnswerAttachmentListRepository
{
  public items: AnswerAttachment[] = []
  async deleteManyByAnswerId(answerId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    )
  }

  async findManyByAnswerAttachmentId(
    answerId: string,
  ): Promise<AnswerAttachment[]> {
    const answerAttachment = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    )
    return answerAttachment
  }
}
