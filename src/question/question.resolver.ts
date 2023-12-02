import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class QuestionResolver {
  @Query(() => Boolean)
  isPizzaGood(): boolean {
    return true;
  }
}
