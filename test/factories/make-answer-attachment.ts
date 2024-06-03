import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  return AnswerAttachment.create(
    {
      attachmentId: new UniqueEntityID('1'),
      answerId: new UniqueEntityID('1'),
      ...override,
    },
    id,
  )
}
