import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class OptionResolver {
  @Query(() => Boolean)
  isPizzaGood(): boolean {
    return true;
  }
}
