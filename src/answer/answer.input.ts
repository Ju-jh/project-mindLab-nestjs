import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AnswerInput {
  @Field()
  questionId: string;

  @Field()
  optionId: string;

  @Field()
  score: number;
}
