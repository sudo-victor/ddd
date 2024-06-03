import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'

export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  return QuestionAttachment.create(
    {
      attachmentId: new UniqueEntityID('1'),
      questionId: new UniqueEntityID('1'),
      ...override,
    },
    id,
  )
}
