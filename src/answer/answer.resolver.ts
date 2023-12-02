import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AnswerResolver {
  @Query(() => Boolean)
  isPizzaGood(): boolean {
    return true;
  }
}
