import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { SendNotificationUseCases } from '../use-cases/send-notification'
import { IAnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen'

export class OnQuestionBestAnswerCreated implements EventHandler {
  constructor(
    private answersRepository: IAnswersRepository,
    private sendNotification: SendNotificationUseCases,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString() as string,
    )

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString() as string,
        title: `A sua resposta foi escolhida`,
        content: 'A resposta que você criou foi escolhida pela comunidade',
      })
    }
  }
}
