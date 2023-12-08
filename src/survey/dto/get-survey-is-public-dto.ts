import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class getSurveyisPublicResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  public: boolean;
}
