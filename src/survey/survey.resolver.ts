import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class SurveyResolver {
  @Query(() => Boolean)
  isPizzaGood(): boolean {
    return true;
  }
}
