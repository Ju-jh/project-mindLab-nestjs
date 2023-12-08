import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class postSurveyResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;
}
