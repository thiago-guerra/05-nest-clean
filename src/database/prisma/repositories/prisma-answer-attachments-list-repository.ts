import { IAnswerAttachmentListRepository } from '@/domain/forum/application/repositories/answer-attachments-list-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswerAttachmentsListRepository
  implements IAnswerAttachmentListRepository
{
  findManyByAnswerAttachmentId(answerId: string): Promise<AnswerAttachment[]> {
    throw new Error('Method not implemented.')
  }

  deleteManyByAnswerId(answerId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
