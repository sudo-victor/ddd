import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID,
) {
  return QuestionComment.create(
    {
      authorId: new UniqueEntityID('1'),
      questionId: new UniqueEntityID('1'),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}
