import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AnswerInput {
  @Field()
  userId: string;

  @Field()
  surveyId: string;

  @Field()
  questionId: string;

  @Field()
  optionId: string;

  @Field()
  score: number;
}
