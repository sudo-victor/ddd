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
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'

let questionRepository: InMemoryQuestionsRepository
let answerRepository: InMemoryAnswersRepository
let notificationRepository: InMemoryNotificationsRepository
let usecase: SendNotificationUseCase

let usecaseExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Question Best Answer Chosen', () => {
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
    new OnQuestionBestAnswerChosen(answerRepository, usecase)
  })

  it('should send a notification when question has new best answer chosen', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    questionRepository.create(question)
    answerRepository.create(answer)

    question.bestAnswerId = answer.id
    questionRepository.save(question)

    await waitFor(() => expect(usecaseExecuteSpy).toHaveBeenCalled())
    await waitFor(() =>
      expect(usecaseExecuteSpy).toHaveBeenCalledWith({
        recipientId: answer.authorId.toString(),
        content: answer.excerpt,
        title: `A resposta que você enviou em "${question.title
          .substring(0, 20)
          .trimEnd()
          .concat('...')}" foi escolhida pelo autor!`,
      }),
    )
  })
})
