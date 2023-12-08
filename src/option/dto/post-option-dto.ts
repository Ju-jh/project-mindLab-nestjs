import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class postOptionResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;
}
