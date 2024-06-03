import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  return AnswerComment.create(
    {
      authorId: new UniqueEntityID('1'),
      answerId: new UniqueEntityID('1'),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}
