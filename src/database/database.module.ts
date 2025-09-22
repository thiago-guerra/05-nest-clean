import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswerAttachmentsListRepository } from './prisma/repositories/prisma-answer-attachments-list-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaQuestionAttachmentListRepository } from './prisma/repositories/prisma-question-attachment-list-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { IQuestionRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'
@Module({
  providers: [
    PrismaService,
    PrismaAnswerAttachmentsListRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentListRepository,
    PrismaQuestionCommentsRepository,
    {
      provide: IQuestionRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
  ],
  exports: [
    PrismaService,
    PrismaAnswerAttachmentsListRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersRepository,
    StudentsRepository,
    PrismaQuestionAttachmentListRepository,
    PrismaQuestionCommentsRepository,
    IQuestionRepository,
  ],
})
export class DatabaseModule {}
