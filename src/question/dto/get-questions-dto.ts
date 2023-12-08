import { ObjectType, Field } from '@nestjs/graphql';
import { Question } from '../question.entity';

@ObjectType()
export class getQuestionsResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => [Question])
  questions: Question[];
}
