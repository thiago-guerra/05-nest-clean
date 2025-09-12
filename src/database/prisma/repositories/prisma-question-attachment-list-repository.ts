import { IQuestionAttachmentListRepository } from '@/domain/forum/application/repositories/question-attachment-list-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionAttachmentListRepository
  implements IQuestionAttachmentListRepository
{
  findManyByQuestionAttachmentId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    throw new Error('Method not implemented.')
  }

  deleteManyByQuestionId(questionId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
