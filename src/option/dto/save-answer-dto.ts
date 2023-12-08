import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SaveAnswerResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;
}
