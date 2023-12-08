import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class postQuestionrResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => String)
  q_id: string;
}
