import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query(() => String)
  userName(): string {
    return 'Jayden';
  }
}
