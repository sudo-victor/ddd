import { makeAnswer } from 'test/factories/make-answer'
import { OnAnswerCreated } from './on-answer-created'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../usecases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeQuestion } from 'test/factories/make-question'
import { SpyInstance } from 'vitest'
import { waitFor } from 'test/utils/waitFor'

let questionRepository: InMemoryQuestionsRepository
let answerRepository: InMemoryAnswersRepository
let notificationRepository: InMemoryNotificationsRepository
let usecase: SendNotificationUseCase

let usecaseExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Created', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionsRepository(
      new InMemoryQuestionAttachmentRepository(),
    )
    answerRepository = new InMemoryAnswersRepository(
      new InMemoryAnswerAttachmentRepository(),
    )

    notificationRepository = new InMemoryNotificationsRepository()
    usecase = new SendNotificationUseCase(notificationRepository)

    usecaseExecuteSpy = vi.spyOn(usecase, 'execute')
    new OnAnswerCreated(questionRepository, usecase)
  })

  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    questionRepository.create(question)
    answerRepository.create(answer)

    await answerRepository.create(answer)

    await waitFor(() => expect(usecaseExecuteSpy).toHaveBeenCalled())
    await waitFor(() =>
      expect(usecaseExecuteSpy).toHaveBeenCalledWith({
        recipientId: question.authorId.toString(),
        content: answer.excerpt,
        title: `Nova resposta em "${question.title
          .substring(0, 40)
          .trimEnd()
          .concat('...')}"`,
      }),
    )
  })
})
