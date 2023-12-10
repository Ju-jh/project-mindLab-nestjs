import { ObjectType, Field } from '@nestjs/graphql';
import { Answer } from '../answer.entity';

@ObjectType()
export class GetAnswerResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => [Answer])
  answers: Answer[];
}
