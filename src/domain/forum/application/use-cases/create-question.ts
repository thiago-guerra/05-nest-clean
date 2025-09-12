import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { IQuestionRepository } from '../repositories/questions-repository'
import { Either, right } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { Injectable } from '@nestjs/common'

interface ICreateQuestionUseCases {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type ICreateQuestionUseCasesResponse = Either<
  null,
  {
    question: Question
  }
>
@Injectable()
export class CreateQuestionUseCases {
  constructor(private createQuestionRepository: IQuestionRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: ICreateQuestionUseCases): Promise<ICreateQuestionUseCasesResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    })

    const attachments = attachmentsIds?.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      })
    })

    const questionAttachmentsList = new QuestionAttachmentList(attachments)
    questionAttachmentsList.update(attachments)

    question.attachments = questionAttachmentsList

    await this.createQuestionRepository.create(question)

    return right({ question })
  }
}
