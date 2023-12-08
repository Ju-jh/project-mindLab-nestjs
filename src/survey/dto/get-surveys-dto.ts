import { ObjectType, Field } from '@nestjs/graphql';
import { Survey } from '../survey.entity';

@ObjectType()
export class getSurveysResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => [Survey])
  surveys: Survey[];
}
