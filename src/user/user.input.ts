import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserInput {
  @Field()
  email: string;

  @Field()
  photo: string;
}
